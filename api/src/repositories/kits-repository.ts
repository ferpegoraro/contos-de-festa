import type { Kit } from "../entities/kit";

export interface CreateKitInput {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  /** Preço promocional — null/ausente herda o preço do tipo. */
  priceOverride?: number | null;
  featured?: boolean;
  kitTypeId: string;
  categoryId: string;
}

export interface UpdateKitInput {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string | null;
  /** null limpa a promoção (volta a herdar); undefined não mexe. */
  priceOverride?: number | null;
  featured?: boolean;
  kitTypeId?: string;
  categoryId?: string;
}

export interface ListKitsFilters {
  kitTypeSlug?: string;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListKitsResult {
  kits: Kit[];
  total: number;
  page: number;
  pageSize: number;
}

export interface KitsRepository {
  findById(id: string): Promise<Kit | null>;
  findBySlug(slug: string): Promise<Kit | null>;
  list(filters?: ListKitsFilters): Promise<ListKitsResult>;
  create(data: CreateKitInput): Promise<Kit>;
  update(id: string, data: UpdateKitInput): Promise<Kit>;
  delete(id: string): Promise<void>;
}
