import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";

export interface CategoryProps {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Category extends Entity<CategoryProps> {
  get name(): string {
    return this.props.name;
  }
  get slug(): string {
    return this.props.slug;
  }
  get description(): string | null {
    return this.props.description;
  }
  get icon(): string | null {
    return this.props.icon;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<
      CategoryProps,
      "description" | "icon" | "createdAt" | "updatedAt"
    >,
    id?: UniqueEntityID,
  ): Category {
    const now = new Date();
    return new Category(
      {
        ...props,
        description: props.description ?? null,
        icon: props.icon ?? null,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }
}
