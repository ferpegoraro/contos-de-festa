import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";

export interface ItemProps {
  /** Nome único no catálogo (ex.: "Arco de balões"). */
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Item do catálogo — cadastrado uma vez e reutilizado pelos Tipos de Kit
 * (que definem a quantidade de cada item).
 */
export class Item extends Entity<ItemProps> {
  get name(): string {
    return this.props.name;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<ItemProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Item {
    const now = new Date();
    return new Item(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }
}
