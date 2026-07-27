import { randomUUID } from "node:crypto";
import { Item } from "../../entities/item";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CreateItemInput,
  ItemsRepository,
  UpdateItemInput,
} from "../items-repository";
import type { InMemoryKitTypesRepository } from "./in-memory-kit-types-repository";

export class InMemoryItemsRepository implements ItemsRepository {
  public items: Item[] = [];
  /** Ligado depois da construção (dependência circular com kit types). */
  public kitTypesRepository: InMemoryKitTypesRepository | null = null;

  async findById(id: string): Promise<Item | null> {
    return this.items.find((item) => String(item.id) === id) ?? null;
  }

  async findByName(name: string): Promise<Item | null> {
    return this.items.find((item) => item.name === name) ?? null;
  }

  async list(): Promise<Item[]> {
    return [...this.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(data: CreateItemInput): Promise<Item> {
    const now = new Date();
    const item = new Item(
      { name: data.name, createdAt: now, updatedAt: now },
      randomUUID() as unknown as UniqueEntityID,
    );
    this.items.push(item);
    return item;
  }

  async update(id: string, data: UpdateItemInput): Promise<Item> {
    const index = this.items.findIndex((item) => String(item.id) === id);
    if (index < 0) {
      throw new Error(`Item ${id} not found`);
    }
    const current = this.items[index];
    const next = new Item(
      {
        name: data.name ?? current.name,
        createdAt: current.createdAt,
        updatedAt: new Date(),
      },
      String(current.id) as unknown as UniqueEntityID,
    );
    this.items[index] = next;
    return next;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => String(item.id) !== id);
  }

  async countUsages(itemId: string): Promise<number> {
    if (!this.kitTypesRepository) return 0;
    return this.kitTypesRepository.items.reduce(
      (count, kitType) =>
        count +
        kitType.items.filter((entry) => entry.itemId === itemId).length,
      0,
    );
  }
}
