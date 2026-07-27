import type { KitType } from "../entities/kit-type";

export interface KitTypeItemInput {
  /** Item do catálogo (tabela items). */
  itemId: string;
  quantity?: number | null;
}

export interface CreateKitTypeInput {
  name: string;
  slug: string;
  price: number;
  items?: KitTypeItemInput[];
}

export interface UpdateKitTypeInput {
  name?: string;
  slug?: string;
  price?: number;
  /** Quando presente, substitui a lista inteira de itens. */
  items?: KitTypeItemInput[];
}

export interface KitTypesRepository {
  findById(id: string): Promise<KitType | null>;
  findBySlug(slug: string): Promise<KitType | null>;
  list(): Promise<KitType[]>;
  create(data: CreateKitTypeInput): Promise<KitType>;
  update(id: string, data: UpdateKitTypeInput): Promise<KitType>;
  delete(id: string): Promise<void>;
}
