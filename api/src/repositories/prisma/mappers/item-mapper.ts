import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { Item } from "../../../entities/item";

type Record = Prisma.ItemGetPayload<true>;

export const ItemMapper = {
  toEntity(record: Record): Item {
    return new Item(
      {
        name: record.name,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
