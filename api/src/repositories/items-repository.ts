import type { Item } from "../entities/item";

export interface CreateItemInput {
  name: string;
}

export interface UpdateItemInput {
  name?: string;
}

export interface ItemsRepository {
  findById(id: string): Promise<Item | null>;
  findByName(name: string): Promise<Item | null>;
  list(): Promise<Item[]>;
  create(data: CreateItemInput): Promise<Item>;
  update(id: string, data: UpdateItemInput): Promise<Item>;
  delete(id: string): Promise<void>;
  /** Quantos tipos de kit usam este item (para bloquear exclusão em uso). */
  countUsages(itemId: string): Promise<number>;
}
