import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";
import type { KitItem } from "./kit-item";

export interface KitTypeProps {
  name: string;
  slug: string;
  /** Preço do aluguel — todos os kits deste tipo herdam (salvo promoção). */
  price: number;
  /** Itens inclusos em todos os kits deste tipo. */
  items: KitItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class KitType extends Entity<KitTypeProps> {
  get name(): string {
    return this.props.name;
  }
  get slug(): string {
    return this.props.slug;
  }
  get price(): number {
    return this.props.price;
  }
  get items(): KitItem[] {
    return this.props.items;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<KitTypeProps, "createdAt" | "updatedAt" | "items">,
    id?: UniqueEntityID,
  ): KitType {
    const now = new Date();
    return new KitType(
      {
        ...props,
        items: props.items ?? [],
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }
}
