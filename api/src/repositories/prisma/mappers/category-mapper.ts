import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { Category } from "../../../entities/category";

type Record = Prisma.CategoryGetPayload<true>;

export const CategoryMapper = {
  toEntity(record: Record): Category {
    return new Category(
      {
        name: record.name,
        slug: record.slug,
        description: record.description,
        icon: record.icon,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
