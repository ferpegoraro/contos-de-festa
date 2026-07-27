import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import type { Kit } from "../../entities/kit";
import type {
  CreateKitInput,
  KitsRepository,
  ListKitsFilters,
  ListKitsResult,
  UpdateKitInput,
} from "../kits-repository";
import { KitMapper, kitInclude } from "./mappers/kit-mapper";

export class PrismaKitsRepository implements KitsRepository {
  async findById(id: string): Promise<Kit | null> {
    const record = await prisma.kit.findUnique({
      where: { id },
      include: kitInclude,
    });
    return record ? KitMapper.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<Kit | null> {
    const record = await prisma.kit.findUnique({
      where: { slug },
      include: kitInclude,
    });
    return record ? KitMapper.toEntity(record) : null;
  }

  async list(filters?: ListKitsFilters): Promise<ListKitsResult> {
    const where: Prisma.KitWhereInput = {};

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }
    if (filters?.kitTypeSlug) {
      where.kitType = { slug: filters.kitTypeSlug };
    }
    if (filters?.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const pageSize =
      filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 24;

    const [records, total] = await Promise.all([
      prisma.kit.findMany({
        where,
        include: kitInclude,
        // agrupa por tipo (alfabético); dentro do grupo, destaques primeiro
        orderBy: [
          { kitType: { name: "asc" } },
          { featured: "desc" },
          { name: "asc" },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.kit.count({ where }),
    ]);
    return {
      kits: records.map(KitMapper.toEntity),
      total,
      page,
      pageSize,
    };
  }

  async create(data: CreateKitInput): Promise<Kit> {
    const record = await prisma.kit.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription ?? null,
        priceOverride: data.priceOverride ?? null,
        featured: data.featured ?? false,
        kitTypeId: data.kitTypeId,
        categoryId: data.categoryId,
      },
      include: kitInclude,
    });
    return KitMapper.toEntity(record);
  }

  async update(id: string, data: UpdateKitInput): Promise<Kit> {
    const record = await prisma.kit.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        // null limpa a promoção; undefined não mexe
        priceOverride: data.priceOverride,
        featured: data.featured,
        kitTypeId: data.kitTypeId,
        categoryId: data.categoryId,
      },
      include: kitInclude,
    });
    return KitMapper.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.kit.delete({ where: { id } });
  }
}
