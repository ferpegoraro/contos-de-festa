import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryItemsRepository } from "../../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitTypesRepository } from "../../repositories/in-memory/in-memory-kit-types-repository";
import { ListKitTypesUseCase } from "./list-kit-types";

describe("ListKitTypesUseCase", () => {
  let kitTypesRepository: InMemoryKitTypesRepository;
  let sut: ListKitTypesUseCase;

  beforeEach(() => {
    kitTypesRepository = new InMemoryKitTypesRepository(
      new InMemoryItemsRepository(),
    );
    sut = new ListKitTypesUseCase(kitTypesRepository);
  });

  it("retorna lista vazia quando não há tipos cadastrados", async () => {
    const { kitTypes } = await sut.execute();
    expect(kitTypes).toEqual([]);
  });

  it("retorna todos os tipos cadastrados", async () => {
    await kitTypesRepository.create({ name: "Kit de Mesa", slug: "kit-de-mesa", price: 100 });
    await kitTypesRepository.create({ name: "Kit 1", slug: "kit-1", price: 100 });
    await kitTypesRepository.create({ name: "Kit 2", slug: "kit-2", price: 100 });

    const { kitTypes } = await sut.execute();

    expect(kitTypes).toHaveLength(3);
    expect(kitTypes.map((k) => k.slug)).toEqual(
      expect.arrayContaining(["kit-de-mesa", "kit-1", "kit-2"]),
    );
  });
});
