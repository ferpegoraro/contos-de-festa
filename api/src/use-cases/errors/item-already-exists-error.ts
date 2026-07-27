export class ItemAlreadyExistsError extends Error {
  constructor() {
    super("Já existe um item com esse nome no catálogo.");
    this.name = "ItemAlreadyExistsError";
  }
}
