export class ResourceInUseError extends Error {
  constructor(resource: string, dependents?: string) {
    const detail = dependents ? ` Há ${dependents} usando esse registro.` : "";
    super(
      `Não é possível excluir ${resource} porque está em uso.${detail} Remova ou realoque os dependentes antes.`,
    );
    this.name = "ResourceInUseError";
  }
}
