export class UnauthorizedError extends Error {
  constructor(message = "Acesso não autorizado.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
