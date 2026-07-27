import { prisma } from "../../lib/prisma";
import type { Category } from "../../entities/category";
import type {
  CategoriesRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../categories-repository";
import { CategoryMapper } from "./mappers/category-mapper";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findById(id: string): Promise<Category | null> {
    const record = await prisma.category.findUnique({ where: { id } });
    return record ? CategoryMapper.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const record = await prisma.category.findUnique({ where: { slug } });
    return record ? CategoryMapper.toEntity(record) : null;
  }

  async list(): Promise<Category[]> {
    const records = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return records.map(CategoryMapper.toEntity);
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const record = await prisma.category.create({ data });
    return CategoryMapper.toEntity(record);
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const record = await prisma.category.update({ where: { id }, data });
    return CategoryMapper.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
