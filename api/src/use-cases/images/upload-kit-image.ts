import type { KitImage } from "../../entities/kit-image";
import type { KitImagesRepository } from "../../repositories/kit-images-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import type { CloudinaryProvider } from "../../lib/cloudinary";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface UploadKitImageUseCaseRequest {
  kitId: string;
  fileBuffer: Buffer;
  filename: string;
  mimetype: string;
  alt?: string | null;
  isPrimary?: boolean;
}

interface UploadKitImageUseCaseResponse {
  image: KitImage;
}

export class UploadKitImageUseCase {
  constructor(
    private kitsRepository: KitsRepository,
    private kitImagesRepository: KitImagesRepository,
    private cloudinary: CloudinaryProvider,
  ) {}

  async execute({
    kitId,
    fileBuffer,
    filename,
    mimetype,
    alt,
    isPrimary,
  }: UploadKitImageUseCaseRequest): Promise<UploadKitImageUseCaseResponse> {
    const kit = await this.kitsRepository.findById(kitId);
    if (!kit) {
      throw new ResourceNotFoundError("Kit");
    }

    const existingCount = await this.kitImagesRepository.countByKitId(kitId);
    const shouldBePrimary = isPrimary ?? existingCount === 0;

    const upload = await this.cloudinary.uploadImage({
      buffer: fileBuffer,
      filename,
      mimetype,
      folder: `contos-de-festas/kits/${kit.slug}`,
    });

    if (shouldBePrimary && existingCount > 0) {
      await this.kitImagesRepository.unsetPrimary(kitId);
    }

    const image = await this.kitImagesRepository.create({
      kitId,
      url: upload.url,
      publicId: upload.publicId,
      alt: alt ?? kit.name,
      order: existingCount,
      isPrimary: shouldBePrimary,
    });

    return { image };
  }
}
