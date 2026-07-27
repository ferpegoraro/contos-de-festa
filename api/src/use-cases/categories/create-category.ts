import type { Category } from "../../entities/category";
import type { CategoriesRepository } from "../../repositories/categories-repository";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface CreateCategoryUseCaseRequest {
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
}

interface CreateCategoryUseCaseResponse {
  category: Category;
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    slug,
    description,
    icon,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const finalSlug = slug ? slugify(slug) : slugify(name);

    const existing = await this.categoriesRepository.findBySlug(finalSlug);
    if (existing) {
      throw new SlugAlreadyExistsError("Categoria");
    }

    const category = await this.categoriesRepository.create({
      name,
      slug: finalSlug,
      description: description ?? null,
      icon: icon ?? null,
    });

    return { category };
  }
}
