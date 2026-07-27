import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  equals(other: UniqueEntityID): boolean {
    if (other === this) return true;
    return other.toValue() === this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
