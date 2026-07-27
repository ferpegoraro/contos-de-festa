import { randomUUID } from "node:crypto";
import { KitImage } from "../../entities/kit-image";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CreateKitImageInput,
  KitImagesRepository,
  ReorderInput,
} from "../kit-images-repository";

export class InMemoryKitImagesRepository implements KitImagesRepository {
  public items: KitImage[] = [];

  async findById(id: string): Promise<KitImage | null> {
    return this.items.find((item) => String(item.id) === id) ?? null;
  }

  async listByKitId(kitId: string): Promise<KitImage[]> {
    return [...this.items]
      .filter((item) => item.kitId === kitId)
      .sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
        return a.order - b.order;
      });
  }

  async create(data: CreateKitImageInput): Promise<KitImage> {
    const image = new KitImage(
      {
        kitId: data.kitId,
        url: data.url,
        publicId: data.publicId,
        alt: data.alt ?? null,
        order: data.order ?? 0,
        isPrimary: data.isPrimary ?? false,
        createdAt: new Date(),
      },
      randomUUID() as unknown as UniqueEntityID,
    );

    this.items.push(image);
    return image;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => String(item.id) !== id);
  }

  async reorder(kitId: string, entries: ReorderInput[]): Promise<KitImage[]> {
    const map = new Map(entries.map((entry) => [entry.id, entry]));

    this.items = this.items.map((item) => {
      if (item.kitId !== kitId) return item;
      const entry = map.get(String(item.id));
      if (!entry) {
        return new KitImage(
          {
            kitId: item.kitId,
            url: item.url,
            publicId: item.publicId,
            alt: item.alt,
            order: item.order,
            isPrimary: false,
            createdAt: item.createdAt,
          },
          String(item.id) as unknown as UniqueEntityID,
        );
      }

      return new KitImage(
        {
          kitId: item.kitId,
          url: item.url,
          publicId: item.publicId,
          alt: item.alt,
          order: entry.order,
          isPrimary: entry.isPrimary ?? false,
          createdAt: item.createdAt,
        },
        String(item.id) as unknown as UniqueEntityID,
      );
    });

    return this.listByKitId(kitId);
  }

  async countByKitId(kitId: string): Promise<number> {
    return this.items.filter((item) => item.kitId === kitId).length;
  }

  async unsetPrimary(kitId: string): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.kitId !== kitId) return item;
      return new KitImage(
        {
          kitId: item.kitId,
          url: item.url,
          publicId: item.publicId,
          alt: item.alt,
          order: item.order,
          isPrimary: false,
          createdAt: item.createdAt,
        },
        String(item.id) as unknown as UniqueEntityID,
      );
    });
  }

  async deleteAllByKitId(kitId: string): Promise<void> {
    this.items = this.items.filter((item) => item.kitId !== kitId);
  }
}
