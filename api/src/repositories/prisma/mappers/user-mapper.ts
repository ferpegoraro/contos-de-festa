import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { User } from "../../../entities/user";

type Record = Prisma.UserGetPayload<true>;

export const UserMapper = {
  toEntity(record: Record): User {
    return new User(
      {
        name: record.name,
        email: record.email,
        passwordHash: record.passwordHash,
        role: record.role,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
