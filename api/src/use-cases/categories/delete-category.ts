import type { CategoriesRepository } from "../../repositories/categories-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteCategoryUseCaseRequest {
  id: string;
}

export class DeleteCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private kitsRepository: KitsRepository,
  ) {}

  async execute({ id }: DeleteCategoryUseCaseRequest): Promise<void> {
    const current = await this.categoriesRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Categoria");
    }

    const { total } = await this.kitsRepository.list({
      categorySlug: current.slug,
      pageSize: 1,
    });
    if (total > 0) {
      throw new ResourceInUseError(
        "esta categoria",
        `${total} ${total === 1 ? "kit" : "kits"}`,
      );
    }

    await this.categoriesRepository.delete(id);
  }
}
