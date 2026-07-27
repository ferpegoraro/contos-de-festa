export class WeakPasswordError extends Error {
  constructor() {
    super("A senha deve ter ao menos 10 caracteres e conter um número.");
    this.name = "WeakPasswordError";
  }
}
