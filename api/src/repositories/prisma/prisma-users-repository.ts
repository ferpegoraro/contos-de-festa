import { prisma } from "../../lib/prisma";
import type { User } from "../../entities/user";
import type {
  CreateUserInput,
  UsersRepository,
} from "../users-repository";
import { UserMapper } from "./mappers/user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? UserMapper.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    return record ? UserMapper.toEntity(record) : null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const record = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? "ADMIN",
      },
    });
    return UserMapper.toEntity(record);
  }
}
