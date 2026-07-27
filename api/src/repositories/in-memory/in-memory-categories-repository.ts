import { randomUUID } from "node:crypto";
import { Category } from "../../entities/category";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CategoriesRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../categories-repository";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];

  async findById(id: string): Promise<Category | null> {
    return this.items.find((item) => String(item.id) === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.items.find((item) => item.slug === slug) ?? null;
  }

  async list(): Promise<Category[]> {
    return [...this.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const now = new Date();
    const category = new Category(
      {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        icon: data.icon ?? null,
        createdAt: now,
        updatedAt: now,
      },
      randomUUID() as unknown as UniqueEntityID,
    );

    this.items.push(category);
    return category;
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const index = this.items.findIndex((item) => String(item.id) === id);
    if (index < 0) {
      throw new Error(`Category ${id} not found`);
    }

    const current = this.items[index];
    const next = new Category(
      {
        name: data.name ?? current.name,
        slug: data.slug ?? current.slug,
        description:
          data.description === undefined ? current.description : data.description,
        icon: data.icon === undefined ? current.icon : data.icon,
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
