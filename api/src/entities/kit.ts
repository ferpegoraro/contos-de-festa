import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";
import type { Category } from "./category";
import type { KitImage } from "./kit-image";
import type { KitType } from "./kit-type";

export interface KitProps {
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  /** Preço promocional do kit — null herda o preço do tipo. */
  priceOverride: number | null;
  featured: boolean;
  kitTypeId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  kitType: KitType;
  category: Category;
  images: KitImage[];
}

export class Kit extends Entity<KitProps> {
  get name(): string {
    return this.props.name;
  }
  get slug(): string {
    return this.props.slug;
  }
  get description(): string {
    return this.props.description;
  }
  get shortDescription(): string | null {
    return this.props.shortDescription;
  }
  get priceOverride(): number | null {
    return this.props.priceOverride;
  }
  /** Preço efetivo: promocional do kit ou, na ausência, o preço do tipo. */
  get price(): number {
    return this.props.priceOverride ?? this.props.kitType.price;
  }
  get featured(): boolean {
    return this.props.featured;
  }
  get kitTypeId(): string {
    return this.props.kitTypeId;
  }
  get categoryId(): string {
    return this.props.categoryId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get kitType(): KitType {
    return this.props.kitType;
  }
  get category(): Category {
    return this.props.category;
  }
  get images(): KitImage[] {
    return this.props.images;
  }

  /** Serializa com o preço efetivo calculado (o frontend lê `price`). */
  toJSON(): unknown {
    return { id: this.id.toString(), ...this.props, price: this.price };
  }

  static create(
    props: Optional<
      KitProps,
      | "shortDescription"
      | "priceOverride"
      | "featured"
      | "createdAt"
      | "updatedAt"
      | "images"
    >,
    id?: UniqueEntityID,
  ): Kit {
    const now = new Date();
    return new Kit(
      {
        ...props,
        shortDescription: props.shortDescription ?? null,
        priceOverride: props.priceOverride ?? null,
        featured: props.featured ?? false,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
        images: props.images ?? [],
      },
      id,
    );
  }
}
