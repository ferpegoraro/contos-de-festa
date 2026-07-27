import { UniqueEntityID } from "./unique-entity-id";

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityID;
  protected props: Props;

  constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  equals(other: Entity<unknown>): boolean {
    if (other === this) return true;
    return other.id.equals(this._id);
  }

  toJSON(): unknown {
    return { id: this._id.toString(), ...this.props };
  }
}
