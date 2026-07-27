import type { KitType } from "../../entities/kit-type";
import type { ItemsRepository } from "../../repositories/items-repository";
import type {
  KitTypeItemInput,
  KitTypesRepository,
} from "../../repositories/kit-types-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface CreateKitTypeUseCaseRequest {
  name: string;
  slug?: string;
  price: number;
  items?: KitTypeItemInput[];
}

interface CreateKitTypeUseCaseResponse {
  kitType: KitType;
}

export class CreateKitTypeUseCase {
  constructor(
    private kitTypesRepository: KitTypesRepository,
    private itemsRepository: ItemsRepository,
  ) {}

  async execute({
    name,
    slug,
    price,
    items,
  }: CreateKitTypeUseCaseRequest): Promise<CreateKitTypeUseCaseResponse> {
    const finalSlug = slug ? slugify(slug) : slugify(name);

    const existing = await this.kitTypesRepository.findBySlug(finalSlug);
    if (existing) {
      throw new SlugAlreadyExistsError("Tipo de kit");
    }

    // todos os itens precisam existir no catálogo
    for (const entry of items ?? []) {
      const item = await this.itemsRepository.findById(entry.itemId);
      if (!item) throw new ResourceNotFoundError("Item");
    }

    const kitType = await this.kitTypesRepository.create({
      name,
      slug: finalSlug,
      price,
      items,
    });

    return { kitType };
  }
}
