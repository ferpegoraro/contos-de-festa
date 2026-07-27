/**
 * Value Object — objeto de domínio sem identidade própria.
 * Dois VOs são iguais quando todas as suas propriedades são iguais.
 */
export abstract class ValueObject<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  equals(other: ValueObject<unknown>): boolean {
    if (other === this) return true;
    if (other === null || other === undefined) return false;
    return JSON.stringify(other.props) === JSON.stringify(this.props);
  }

  toJSON(): unknown {
    return { ...this.props };
  }
}
