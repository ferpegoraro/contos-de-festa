import type { KitImage } from "../../entities/kit-image";
import type {
  KitImagesRepository,
  ReorderInput,
} from "../../repositories/kit-images-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface ReorderKitImagesUseCaseRequest {
  kitId: string;
  items: ReorderInput[];
}

interface ReorderKitImagesUseCaseResponse {
  images: KitImage[];
}

export class ReorderKitImagesUseCase {
  constructor(
    private kitsRepository: KitsRepository,
    private kitImagesRepository: KitImagesRepository,
  ) {}

  async execute({
    kitId,
    items,
  }: ReorderKitImagesUseCaseRequest): Promise<ReorderKitImagesUseCaseResponse> {
    const kit = await this.kitsRepository.findById(kitId);
    if (!kit) {
      throw new ResourceNotFoundError("Kit");
    }

    const current = await this.kitImagesRepository.listByKitId(kitId);
    const currentIds = new Set(current.map((image) => image.id.toString()));
    for (const item of items) {
      if (!currentIds.has(item.id)) {
        throw new ResourceNotFoundError("Imagem");
      }
    }

    const images = await this.kitImagesRepository.reorder(kitId, items);
    return { images };
  }
}
