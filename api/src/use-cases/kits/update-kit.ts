import type { Kit } from "../../entities/kit";
import type { CategoriesRepository } from "../../repositories/categories-repository";
import type { KitTypesRepository } from "../../repositories/kit-types-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface UpdateKitUseCaseRequest {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string | null;
  /** null limpa a promoção (volta a herdar); undefined não mexe. */
  priceOverride?: number | null;
  featured?: boolean;
  kitTypeId?: string;
  categoryId?: string;
}

interface UpdateKitUseCaseResponse {
  kit: Kit;
}

export class UpdateKitUseCase {
  constructor(
    private kitsRepository: KitsRepository,
    private kitTypesRepository: KitTypesRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    id,
    name,
    slug,
    description,
    shortDescription,
    priceOverride,
    featured,
    kitTypeId,
    categoryId,
  }: UpdateKitUseCaseRequest): Promise<UpdateKitUseCaseResponse> {
    const current = await this.kitsRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Kit");
    }

    if (kitTypeId) {
      const kitType = await this.kitTypesRepository.findById(kitTypeId);
      if (!kitType) throw new ResourceNotFoundError("Tipo de kit");
    }

    if (categoryId) {
      const category = await this.categoriesRepository.findById(categoryId);
      if (!category) throw new ResourceNotFoundError("Categoria");
    }

    let nextSlug: string | undefined;
    if (slug !== undefined) {
      nextSlug = slugify(slug);
    } else if (name !== undefined && !slug) {
      nextSlug = slugify(name);
    }

    if (nextSlug && nextSlug !== current.slug) {
      const conflict = await this.kitsRepository.findBySlug(nextSlug);
      if (conflict && conflict.id.toString() !== id) {
        throw new SlugAlreadyExistsError("Kit");
      }
    }

    const kit = await this.kitsRepository.update(id, {
      name,
      slug: nextSlug,
      description,
      shortDescription,
      priceOverride,
      featured,
      kitTypeId,
      categoryId,
    });

    return { kit };
  }
}
