import type { KitImage } from "../entities/kit-image";

export interface CreateKitImageInput {
  kitId: string;
  url: string;
  publicId: string;
  alt?: string | null;
  order?: number;
  isPrimary?: boolean;
}

export interface ReorderInput {
  id: string;
  order: number;
  isPrimary?: boolean;
}

export interface KitImagesRepository {
  findById(id: string): Promise<KitImage | null>;
  listByKitId(kitId: string): Promise<KitImage[]>;
  create(data: CreateKitImageInput): Promise<KitImage>;
  delete(id: string): Promise<void>;
  reorder(kitId: string, items: ReorderInput[]): Promise<KitImage[]>;
  countByKitId(kitId: string): Promise<number>;
  unsetPrimary(kitId: string): Promise<void>;
}
