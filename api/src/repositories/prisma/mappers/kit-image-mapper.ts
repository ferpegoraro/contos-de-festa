import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { KitImage } from "../../../entities/kit-image";

type Record = Prisma.KitImageGetPayload<true>;

export const KitImageMapper = {
  toEntity(record: Record): KitImage {
    return new KitImage(
      {
        kitId: record.kitId,
        url: record.url,
        publicId: record.publicId,
        alt: record.alt,
        order: record.order,
        isPrimary: record.isPrimary,
        createdAt: record.createdAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
