import type { Category } from "../../entities/category";
import type { CategoriesRepository } from "../../repositories/categories-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { slugify } from "../../utils/slugify";

interface UpdateCategoryUseCaseRequest {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
}

interface UpdateCategoryUseCaseResponse {
  category: Category;
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
    name,
    slug,
    description,
    icon,
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const current = await this.categoriesRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Categoria");
    }

    let nextSlug: string | undefined;
    if (slug !== undefined) {
      nextSlug = slugify(slug);
    } else if (name !== undefined && !slug) {
      nextSlug = slugify(name);
    }

    if (nextSlug && nextSlug !== current.slug) {
      const conflict = await this.categoriesRepository.findBySlug(nextSlug);
      if (conflict && conflict.id.toString() !== id) {
        throw new SlugAlreadyExistsError("Categoria");
      }
    }

    const category = await this.categoriesRepository.update(id, {
      name,
      slug: nextSlug,
      description,
      icon,
    });

    return { category };
  }
}
