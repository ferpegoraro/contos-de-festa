import { randomUUID } from "node:crypto";
import { User } from "../../entities/user";
import type { UniqueEntityID } from "../../core/entities/unique-entity-id";
import type {
  CreateUserInput,
  UsersRepository,
} from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => String(item.id) === id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const now = new Date();
    const user = new User(
      {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? "USER",
        createdAt: now,
        updatedAt: now,
      },
      randomUUID() as unknown as UniqueEntityID,
    );

    this.items.push(user);
    return user;
  }
}
