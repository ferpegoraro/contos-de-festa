import type { KitsRepository } from "../../repositories/kits-repository";
import type { KitImagesRepository } from "../../repositories/kit-images-repository";
import type { CloudinaryProvider } from "../../lib/cloudinary";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteKitUseCaseRequest {
  id: string;
}

export class DeleteKitUseCase {
  constructor(
    private kitsRepository: KitsRepository,
    private kitImagesRepository: KitImagesRepository,
    private cloudinary: CloudinaryProvider,
  ) {}

  async execute({ id }: DeleteKitUseCaseRequest): Promise<void> {
    const current = await this.kitsRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Kit");
    }

    const images = await this.kitImagesRepository.listByKitId(id);

    await this.kitsRepository.delete(id);

    await Promise.allSettled(
      images.map((image) => this.cloudinary.deleteImage(image.publicId)),
    );
  }
}
