import type { KitType } from "../../entities/kit-type";
import type { ItemsRepository } from "../../repositories/items-repository";
import type {
  KitTypeItemInput,
  KitTypesRepository,
} from "../../repositories/kit-types-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface UpdateKitTypeUseCaseRequest {
  id: string;
  name?: string;
  slug?: string;
  price?: number;
  /** Quando presente, substitui a lista inteira de itens. */
  items?: KitTypeItemInput[];
}

interface UpdateKitTypeUseCaseResponse {
  kitType: KitType;
}

export class UpdateKitTypeUseCase {
  constructor(
    private kitTypesRepository: KitTypesRepository,
    private itemsRepository: ItemsRepository,
  ) {}

  async execute({
    id,
    name,
    slug,
    price,
    items,
  }: UpdateKitTypeUseCaseRequest): Promise<UpdateKitTypeUseCaseResponse> {
    const current = await this.kitTypesRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Tipo de kit");
    }

    let nextSlug: string | undefined;
    if (slug !== undefined) {
      nextSlug = slugify(slug);
    } else if (name !== undefined && !slug) {
      nextSlug = slugify(name);
    }

    if (nextSlug && nextSlug !== current.slug) {
      const conflict = await this.kitTypesRepository.findBySlug(nextSlug);
      if (conflict && conflict.id.toString() !== id) {
        throw new SlugAlreadyExistsError("Tipo de kit");
      }
    }

    // todos os itens precisam existir no catálogo
    for (const entry of items ?? []) {
      const item = await this.itemsRepository.findById(entry.itemId);
      if (!item) throw new ResourceNotFoundError("Item");
    }

    const kitType = await this.kitTypesRepository.update(id, {
      name,
      slug: nextSlug,
      price,
      items,
    });

    return { kitType };
  }
}
