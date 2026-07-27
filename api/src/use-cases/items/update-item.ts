import type { Item } from "../../entities/item";
import type { ItemsRepository } from "../../repositories/items-repository";
import { ItemAlreadyExistsError } from "../errors/item-already-exists-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface UpdateItemUseCaseRequest {
  id: string;
  name?: string;
}

interface UpdateItemUseCaseResponse {
  item: Item;
}

export class UpdateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute({
    id,
    name,
  }: UpdateItemUseCaseRequest): Promise<UpdateItemUseCaseResponse> {
    const current = await this.itemsRepository.findById(id);
    if (!current) {
      throw new ResourceNotFoundError("Item");
    }

    const finalName = name?.trim();
    if (finalName && finalName !== current.name) {
      const conflict = await this.itemsRepository.findByName(finalName);
      if (conflict && conflict.id.toString() !== id) {
        throw new ItemAlreadyExistsError();
      }
    }

    const item = await this.itemsRepository.update(id, { name: finalName });
    return { item };
  }
}
