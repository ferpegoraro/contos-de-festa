import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { KitItem } from "../../../entities/kit-item";
import { KitType } from "../../../entities/kit-type";

export const kitTypeInclude = {
  items: {
    include: { item: true },
    orderBy: { item: { name: "asc" } },
  },
} satisfies Prisma.KitTypeInclude;

type Record = Prisma.KitTypeGetPayload<{ include: typeof kitTypeInclude }>;

export const KitTypeMapper = {
  toEntity(record: Record): KitType {
    return new KitType(
      {
        name: record.name,
        slug: record.slug,
        price: Number(record.price),
        items: record.items.map((entry) =>
          KitItem.create({
            itemId: entry.itemId,
            name: entry.item.name,
            quantity: entry.quantity,
          }),
        ),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
