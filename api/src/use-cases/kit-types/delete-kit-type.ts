import type { KitTypesRepository } from "../../repositories/kit-types-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteKitTypeUseCaseRequest {
  id: string;
}

export class DeleteKitTypeUseCase {
  constructor(
    private kitTypesRepository: KitTypesRepository,
    private kitsRepository: KitsRepository,
  ) {}

  async execute({ id }: DeleteKitTypeUseCaseRequest): Promise<void> {
    const current = await this.kitTypesRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Tipo de kit");
    }

    const { total } = await this.kitsRepository.list({
      kitTypeSlug: current.slug,
      pageSize: 1,
    });
    if (total > 0) {
      throw new ResourceInUseError(
        "este tipo de kit",
        `${total} ${total === 1 ? "kit" : "kits"}`,
      );
    }

    await this.kitTypesRepository.delete(id);
  }
}
