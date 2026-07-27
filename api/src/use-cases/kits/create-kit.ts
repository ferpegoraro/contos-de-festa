import type { Kit } from "../../entities/kit";
import type { CategoriesRepository } from "../../repositories/categories-repository";
import type { KitTypesRepository } from "../../repositories/kit-types-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface CreateKitUseCaseRequest {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string | null;
  /** Preço promocional — null/ausente herda o preço do tipo. */
  priceOverride?: number | null;
  featured?: boolean;
  kitTypeId: string;
  categoryId: string;
}

interface CreateKitUseCaseResponse {
  kit: Kit;
}

export class CreateKitUseCase {
  constructor(
    private kitsRepository: KitsRepository,
    private kitTypesRepository: KitTypesRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    name,
    slug,
    description,
    shortDescription,
    priceOverride,
    featured,
    kitTypeId,
    categoryId,
  }: CreateKitUseCaseRequest): Promise<CreateKitUseCaseResponse> {
    const [kitType, category] = await Promise.all([
      this.kitTypesRepository.findById(kitTypeId),
      this.categoriesRepository.findById(categoryId),
    ]);

    if (!kitType) throw new ResourceNotFoundError("Tipo de kit");
    if (!category) throw new ResourceNotFoundError("Categoria");

    const finalSlug = slug ? slugify(slug) : slugify(name);

    const existing = await this.kitsRepository.findBySlug(finalSlug);
    if (existing) {
      throw new SlugAlreadyExistsError("Kit");
    }

    const kit = await this.kitsRepository.create({
      name,
      slug: finalSlug,
      description,
      shortDescription: shortDescription ?? null,
      priceOverride: priceOverride ?? null,
      featured: featured ?? false,
      kitTypeId,
      categoryId,
    });

    return { kit };
  }
}
