import { ValueObject } from "../core/entities/value-object";
import type { Optional } from "../core/types/optional";

export interface KitItemProps {
  /** Referência ao item do catálogo. */
  itemId: string;
  /** Nome do item (desnormalizado do catálogo para exibição). */
  name: string;
  quantity: number | null;
}

/**
 * Value Object — item incluso em um Tipo de Kit (ex.: "Arco de balões ×1").
 * Liga um item do catálogo (`itemId`) à quantidade naquele tipo. Não tem
 * identidade própria: dois valores com mesmo item e quantidade são iguais.
 */
export class KitItem extends ValueObject<KitItemProps> {
  get itemId(): string {
    return this.props.itemId;
  }
  get name(): string {
    return this.props.name;
  }
  get quantity(): number | null {
    return this.props.quantity;
  }

  static create(props: Optional<KitItemProps, "quantity">): KitItem {
    return new KitItem({
      ...props,
      quantity: props.quantity ?? null,
    });
  }
}
