import type { Item } from "../../entities/item";
import type { ItemsRepository } from "../../repositories/items-repository";
import { ItemAlreadyExistsError } from "../errors/item-already-exists-error";

interface CreateItemUseCaseRequest {
  name: string;
}

interface CreateItemUseCaseResponse {
  item: Item;
}

export class CreateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute({
    name,
  }: CreateItemUseCaseRequest): Promise<CreateItemUseCaseResponse> {
    const finalName = name.trim();

    const existing = await this.itemsRepository.findByName(finalName);
    if (existing) {
      throw new ItemAlreadyExistsError();
    }

    const item = await this.itemsRepository.create({ name: finalName });
    return { item };
  }
}
