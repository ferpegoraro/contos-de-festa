import type { Kit } from "../../entities/kit";
import type { KitsRepository } from "../../repositories/kits-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface GetKitBySlugUseCaseRequest {
  slug: string;
}

interface GetKitBySlugUseCaseResponse {
  kit: Kit;
}

export class GetKitBySlugUseCase {
  constructor(private kitsRepository: KitsRepository) {}

  async execute({
    slug,
  }: GetKitBySlugUseCaseRequest): Promise<GetKitBySlugUseCaseResponse> {
    const kit = await this.kitsRepository.findBySlug(slug);
    if (!kit) {
      throw new ResourceNotFoundError("Kit");
    }
    return { kit };
  }
}
