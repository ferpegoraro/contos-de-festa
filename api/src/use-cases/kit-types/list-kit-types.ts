import type { KitType } from "../../entities/kit-type";
import type { KitTypesRepository } from "../../repositories/kit-types-repository";

interface ListKitTypesUseCaseResponse {
  kitTypes: KitType[];
}

export class ListKitTypesUseCase {
  constructor(private kitTypesRepository: KitTypesRepository) {}

  async execute(): Promise<ListKitTypesUseCaseResponse> {
    const kitTypes = await this.kitTypesRepository.list();
    return { kitTypes };
  }
}
