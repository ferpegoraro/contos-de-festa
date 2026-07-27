export class SlugAlreadyExistsError extends Error {
  constructor(resource = "Recurso") {
    super(`${resource} com este slug já existe.`);
    this.name = "SlugAlreadyExistsError";
  }
}
