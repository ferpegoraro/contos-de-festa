import type { Item } from "../../entities/item";
import type { ItemsRepository } from "../../repositories/items-repository";

interface ListItemsUseCaseResponse {
  items: Item[];
}

export class ListItemsUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute(): Promise<ListItemsUseCaseResponse> {
    const items = await this.itemsRepository.list();
    return { items };
  }
}
