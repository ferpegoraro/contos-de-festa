import { randomUUID } from "node:crypto";
import { KitItem } from "../../entities/kit-item";
import { KitType } from "../../entities/kit-type";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CreateKitTypeInput,
  KitTypeItemInput,
  KitTypesRepository,
  UpdateKitTypeInput,
} from "../kit-types-repository";
import type { InMemoryItemsRepository } from "./in-memory-items-repository";

export class InMemoryKitTypesRepository implements KitTypesRepository {
  public items: KitType[] = [];

  constructor(private itemsRepository: InMemoryItemsRepository) {
    itemsRepository.kitTypesRepository = this;
  }

  private async toKitItems(
    inputs: KitTypeItemInput[] | undefined,
  ): Promise<KitItem[]> {
    const result: KitItem[] = [];
    for (const input of inputs ?? []) {
      const item = await this.itemsRepository.findById(input.itemId);
      result.push(
        KitItem.create({
          itemId: input.itemId,
          name: item?.name ?? "(item removido)",
          quantity: input.quantity ?? null,
        }),
      );
    }
    return result;
  }

  async findById(id: string): Promise<KitType | null> {
    return this.items.find((item) => String(item.id) === id) ?? null;
  }

  async findBySlug(slug: string): Promise<KitType | null> {
    return this.items.find((item) => item.slug === slug) ?? null;
  }

  async list(): Promise<KitType[]> {
    return [...this.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(data: CreateKitTypeInput): Promise<KitType> {
    const now = new Date();
    const kitType = new KitType(
      {
        name: data.name,
        slug: data.slug,
        price: data.price,
        items: await this.toKitItems(data.items),
        createdAt: now,
        updatedAt: now,
      },
      randomUUID() as unknown as UniqueEntityID,
    );

    this.items.push(kitType);
    return kitType;
  }

  async update(id: string, data: UpdateKitTypeInput): Promise<KitType> {
    const index = this.items.findIndex((item) => String(item.id) === id);
    if (index < 0) {
      throw new Error(`KitType ${id} not found`);
    }

    const current = this.items[index];
    const next = new KitType(
      {
        name: data.name ?? current.name,
        slug: data.slug ?? current.slug,
        price: data.price ?? current.price,
        // items presente = substitui a lista inteira
        items: data.items ? await this.toKitItems(data.items) : current.items,
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
}
