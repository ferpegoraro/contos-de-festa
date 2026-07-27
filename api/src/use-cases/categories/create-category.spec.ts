import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCategoriesRepository } from "../../repositories/in-memory/in-memory-categories-repository";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { CreateCategoryUseCase } from "./create-category";

describe("CreateCategoryUseCase", () => {
  let categoriesRepository: InMemoryCategoriesRepository;
  let sut: CreateCategoryUseCase;

  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  it("cria categoria gerando slug a partir do nome quando não informado", async () => {
    const { category } = await sut.execute({
      name: "Chá de Bebê",
    });

    expect(category.name).toBe("Chá de Bebê");
    expect(category.slug).toBe("cha-de-bebe");
    expect(category.description).toBeNull();
    expect(category.icon).toBeNull();
    expect(categoriesRepository.items).toHaveLength(1);
  });

  it("normaliza o slug informado pelo usuário", async () => {
    const { category } = await sut.execute({
      name: "Aniversário",
      slug: "Festa De Aniversário",
    });

    expect(category.slug).toBe("festa-de-aniversario");
  });

  it("rejeita quando já existe categoria com o mesmo slug", async () => {
    await sut.execute({ name: "Aniversário" });

    await expect(() =>
      sut.execute({ name: "aniversario", slug: "aniversário" }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);

    expect(categoriesRepository.items).toHaveLength(1);
  });

  it("preserva descrição e ícone quando informados", async () => {
    const { category } = await sut.execute({
      name: "Casamento",
      description: "Kits para casamentos e bodas",
      icon: "💍",
    });

    expect(category.description).toBe("Kits para casamentos e bodas");
    expect(category.icon).toBe("💍");
  });
});
