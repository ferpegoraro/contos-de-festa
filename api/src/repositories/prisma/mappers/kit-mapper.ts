import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { Kit } from "../../../entities/kit";
import { CategoryMapper } from "./category-mapper";
import { KitImageMapper } from "./kit-image-mapper";
import { KitTypeMapper, kitTypeInclude } from "./kit-type-mapper";

export const kitInclude = {
  kitType: { include: kitTypeInclude },
  category: true,
  images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
} satisfies Prisma.KitInclude;

type Record = Prisma.KitGetPayload<{ include: typeof kitInclude }>;

export const KitMapper = {
  toEntity(record: Record): Kit {
    return new Kit(
      {
        name: record.name,
        slug: record.slug,
        description: record.description,
        shortDescription: record.shortDescription,
        priceOverride:
          record.priceOverride === null ? null : Number(record.priceOverride),
        featured: record.featured,
        kitTypeId: record.kitTypeId,
        categoryId: record.categoryId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        kitType: KitTypeMapper.toEntity(record.kitType),
        category: CategoryMapper.toEntity(record.category),
        images: record.images.map(KitImageMapper.toEntity),
      },
      new UniqueEntityID(record.id),
    );
  },
};
