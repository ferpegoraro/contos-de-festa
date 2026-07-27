import type { Kit } from "../../entities/kit";
import type {
  KitsRepository,
  ListKitsFilters,
} from "../../repositories/kits-repository";

interface ListKitsUseCaseResponse {
  kits: Kit[];
  total: number;
  page: number;
  pageSize: number;
}

export class ListKitsUseCase {
  constructor(private kitsRepository: KitsRepository) {}

  async execute(filters?: ListKitsFilters): Promise<ListKitsUseCaseResponse> {
    return this.kitsRepository.list(filters);
  }
}
