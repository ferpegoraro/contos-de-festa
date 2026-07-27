import type { ItemsRepository } from "../../repositories/items-repository";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteItemUseCaseRequest {
  id: string;
}

export class DeleteItemUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute({ id }: DeleteItemUseCaseRequest): Promise<void> {
    const item = await this.itemsRepository.findById(id);
    if (!item) {
      throw new ResourceNotFoundError("Item");
    }

    const usages = await this.itemsRepository.countUsages(id);
    if (usages > 0) {
      throw new ResourceInUseError("o item", `${usages} tipo(s) de kit`);
    }

    await this.itemsRepository.delete(id);
  }
}
