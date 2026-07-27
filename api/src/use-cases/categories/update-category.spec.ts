import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCategoriesRepository } from "../../repositories/in-memory/in-memory-categories-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { UpdateCategoryUseCase } from "./update-category";

describe("UpdateCategoryUseCase", () => {
  let categoriesRepository: InMemoryCategoriesRepository;
  let sut: UpdateCategoryUseCase;

  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new UpdateCategoryUseCase(categoriesRepository);
  });

  it("atualiza nome e regenera o slug quando o slug não é informado", async () => {
    const created = await categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });

    const { category } = await sut.execute({
      id: String(created.id),
      name: "Aniversário Infantil",
    });

    expect(category.name).toBe("Aniversário Infantil");
    expect(category.slug).toBe("aniversario-infantil");
  });

  it("normaliza o slug informado explicitamente", async () => {
    const created = await categoriesRepository.create({
      name: "Casamento",
      slug: "casamento",
    });

    const { category } = await sut.execute({
      id: String(created.id),
      slug: "Bodas De Prata",
    });

    expect(category.slug).toBe("bodas-de-prata");
  });

  it("permite manter o mesmo slug ao reenviá-lo", async () => {
    const created = await categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });

    const { category } = await sut.execute({
      id: String(created.id),
      slug: "aniversario",
      icon: "🎂",
    });

    expect(category.slug).toBe("aniversario");
    expect(category.icon).toBe("🎂");
  });

  it("rejeita quando o novo slug já é usado por outra categoria", async () => {
    await categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });
    const target = await categoriesRepository.create({
      name: "Casamento",
      slug: "casamento",
    });

    await expect(() =>
      sut.execute({ id: String(target.id), slug: "aniversario" }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);
  });

  it("rejeita quando a categoria não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe", name: "X" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("permite limpar descrição e ícone passando null explicitamente", async () => {
    const created = await categoriesRepository.create({
      name: "Casamento",
      slug: "casamento",
      description: "antiga descrição",
      icon: "💍",
    });

    const { category } = await sut.execute({
      id: String(created.id),
      description: null,
      icon: null,
    });

    expect(category.description).toBeNull();
    expect(category.icon).toBeNull();
  });
});
