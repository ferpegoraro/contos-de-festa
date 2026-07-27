import type { KitImagesRepository } from "../../repositories/kit-images-repository";
import type { CloudinaryProvider } from "../../lib/cloudinary";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteKitImageUseCaseRequest {
  kitId: string;
  imageId: string;
}

export class DeleteKitImageUseCase {
  constructor(
    private kitImagesRepository: KitImagesRepository,
    private cloudinary: CloudinaryProvider,
  ) {}

  async execute({
    kitId,
    imageId,
  }: DeleteKitImageUseCaseRequest): Promise<void> {
    const image = await this.kitImagesRepository.findById(imageId);
    if (!image || image.kitId !== kitId) {
      throw new ResourceNotFoundError("Imagem");
    }

    await this.kitImagesRepository.delete(imageId);
    await this.cloudinary.deleteImage(image.publicId).catch(() => {});
  }
}
