import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCategoriesRepository } from "../../repositories/in-memory/in-memory-categories-repository";
import { ListCategoriesUseCase } from "./list-categories";

describe("ListCategoriesUseCase", () => {
  let categoriesRepository: InMemoryCategoriesRepository;
  let sut: ListCategoriesUseCase;

  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new ListCategoriesUseCase(categoriesRepository);
  });

  it("retorna lista vazia quando não há categorias", async () => {
    const { categories } = await sut.execute();
    expect(categories).toEqual([]);
  });

  it("retorna todas as categorias cadastradas", async () => {
    await categoriesRepository.create({ name: "Aniversário", slug: "aniversario" });
    await categoriesRepository.create({ name: "Chá de Bebê", slug: "cha-de-bebe" });
    await categoriesRepository.create({ name: "Casamento", slug: "casamento" });

    const { categories } = await sut.execute();

    expect(categories).toHaveLength(3);
    expect(categories.map((c) => c.slug)).toEqual(
      expect.arrayContaining(["aniversario", "cha-de-bebe", "casamento"]),
    );
  });
});
