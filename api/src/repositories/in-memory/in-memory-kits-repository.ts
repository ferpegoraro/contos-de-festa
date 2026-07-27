import { randomUUID } from "node:crypto";
import { Kit } from "../../entities/kit";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CreateKitInput,
  KitsRepository,
  ListKitsFilters,
  ListKitsResult,
  UpdateKitInput,
} from "../kits-repository";
import type { InMemoryCategoriesRepository } from "./in-memory-categories-repository";
import type { InMemoryKitImagesRepository } from "./in-memory-kit-images-repository";
import type { InMemoryKitTypesRepository } from "./in-memory-kit-types-repository";

interface KitRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  priceOverride: number | null;
  featured: boolean;
  kitTypeId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class InMemoryKitsRepository implements KitsRepository {
  public records: KitRecord[] = [];

  constructor(
    private kitTypesRepository: InMemoryKitTypesRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
    private kitImagesRepository: InMemoryKitImagesRepository,
  ) {}

  private async hydrate(record: KitRecord): Promise<Kit | null> {
    const [kitType, category, images] = await Promise.all([
      this.kitTypesRepository.findById(record.kitTypeId),
      this.categoriesRepository.findById(record.categoryId),
      this.kitImagesRepository.listByKitId(record.id),
    ]);

    if (!kitType || !category) {
      return null;
    }

    return new Kit(
      {
        name: record.name,
        slug: record.slug,
        description: record.description,
        shortDescription: record.shortDescription,
        priceOverride: record.priceOverride,
        featured: record.featured,
        kitTypeId: record.kitTypeId,
        categoryId: record.categoryId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        kitType,
        category,
        images,
      },
      record.id as unknown as UniqueEntityID,
    );
  }

  async findById(id: string): Promise<Kit | null> {
    const record = this.records.find((item) => item.id === id);
    if (!record) return null;
    return this.hydrate(record);
  }

  async findBySlug(slug: string): Promise<Kit | null> {
    const record = this.records.find((item) => item.slug === slug);
    if (!record) return null;
    return this.hydrate(record);
  }

  async list(filters?: ListKitsFilters): Promise<ListKitsResult> {
    const filtered: { record: KitRecord; typeName: string }[] = [];

    for (const record of this.records) {
      if (filters?.featured !== undefined && record.featured !== filters.featured) {
        continue;
      }

      if (filters?.kitTypeSlug) {
        const kitType = await this.kitTypesRepository.findById(record.kitTypeId);
        if (!kitType || kitType.slug !== filters.kitTypeSlug) continue;
      }

      if (filters?.categorySlug) {
        const category = await this.categoriesRepository.findById(record.categoryId);
        if (!category || category.slug !== filters.categorySlug) continue;
      }

      if (filters?.search) {
        const term = filters.search.toLowerCase();
        const matchesName = record.name.toLowerCase().includes(term);
        const matchesDescription = record.description.toLowerCase().includes(term);
        if (!matchesName && !matchesDescription) continue;
      }

      const kitType = await this.kitTypesRepository.findById(record.kitTypeId);
      filtered.push({ record, typeName: kitType?.name ?? "" });
    }

    // agrupa por tipo (alfabético); dentro do grupo, destaques primeiro
    filtered.sort((a, b) => {
      const byType = a.typeName.localeCompare(b.typeName);
      if (byType !== 0) return byType;
      if (a.record.featured !== b.record.featured) {
        return a.record.featured ? -1 : 1;
      }
      return a.record.name.localeCompare(b.record.name);
    });

    const total = filtered.length;
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const pageSize =
      filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 24;
    const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

    const kits: Kit[] = [];
    for (const { record } of slice) {
      const kit = await this.hydrate(record);
      if (kit) kits.push(kit);
    }
    return { kits, total, page, pageSize };
  }

  async create(data: CreateKitInput): Promise<Kit> {
    const now = new Date();
    const record: KitRecord = {
      id: randomUUID(),
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription ?? null,
      priceOverride: data.priceOverride ?? null,
      featured: data.featured ?? false,
      kitTypeId: data.kitTypeId,
      categoryId: data.categoryId,
      createdAt: now,
      updatedAt: now,
    };

    this.records.push(record);
    const hydrated = await this.hydrate(record);
    if (!hydrated) {
      throw new Error("Falha ao hidratar Kit recém-criado.");
    }
    return hydrated;
  }

  async update(id: string, data: UpdateKitInput): Promise<Kit> {
    const index = this.records.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error(`Kit ${id} not found`);
    }

    const current = this.records[index];
    const updated: KitRecord = {
      ...current,
      name: data.name ?? current.name,
      slug: data.slug ?? current.slug,
      description: data.description ?? current.description,
      shortDescription:
        data.shortDescription === undefined
          ? current.shortDescription
          : data.shortDescription,
      // null limpa a promoção; undefined não mexe
      priceOverride:
        data.priceOverride === undefined
          ? current.priceOverride
          : data.priceOverride,
      featured: data.featured ?? current.featured,
      kitTypeId: data.kitTypeId ?? current.kitTypeId,
      categoryId: data.categoryId ?? current.categoryId,
      updatedAt: new Date(),
    };

    this.records[index] = updated;
    const hydrated = await this.hydrate(updated);
    if (!hydrated) {
      throw new Error("Falha ao hidratar Kit atualizado.");
    }
    return hydrated;
  }

  async delete(id: string): Promise<void> {
    this.records = this.records.filter((item) => item.id !== id);
    await this.kitImagesRepository.deleteAllByKitId(id);
  }
}
