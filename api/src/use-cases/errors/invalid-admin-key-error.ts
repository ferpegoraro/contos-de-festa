export class InvalidAdminKeyError extends Error {
  constructor() {
    super("Chave de admin inválida.");
    this.name = "InvalidAdminKeyError";
  }
}
