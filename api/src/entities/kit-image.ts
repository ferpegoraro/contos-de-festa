import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";

export interface KitImageProps {
  kitId: string;
  url: string;
  publicId: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
  createdAt: Date;
}

export class KitImage extends Entity<KitImageProps> {
  get kitId(): string {
    return this.props.kitId;
  }
  get url(): string {
    return this.props.url;
  }
  get publicId(): string {
    return this.props.publicId;
  }
  get alt(): string | null {
    return this.props.alt;
  }
  get order(): number {
    return this.props.order;
  }
  get isPrimary(): boolean {
    return this.props.isPrimary;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Optional<
      KitImageProps,
      "alt" | "order" | "isPrimary" | "createdAt"
    >,
    id?: UniqueEntityID,
  ): KitImage {
    return new KitImage(
      {
        ...props,
        alt: props.alt ?? null,
        order: props.order ?? 0,
        isPrimary: props.isPrimary ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
