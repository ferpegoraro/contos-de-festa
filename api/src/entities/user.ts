import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";

export type UserRole = "ADMIN" | "USER";

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }
  get email(): string {
    return this.props.email;
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }
  get role(): UserRole {
    return this.props.role;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<UserProps, "role" | "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): User {
    const now = new Date();
    return new User(
      {
        ...props,
        role: props.role ?? "USER",
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }

  toJSON(): {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id.toString(),
      name: this.props.name,
      email: this.props.email,
      role: this.props.role,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
