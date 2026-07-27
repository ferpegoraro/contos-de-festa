import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteCategoryUseCase } from "./delete-category";

describe("DeleteCategoryUseCase", () => {
  let ctx: KitContext;
  let sut: DeleteCategoryUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new DeleteCategoryUseCase(ctx.categoriesRepository, ctx.kitsRepository);
  });

  it("remove a categoria existente quando não há kits vinculados", async () => {
    const created = await ctx.categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });

    await sut.execute({ id: String(created.id) });

    expect(ctx.categoriesRepository.items).toHaveLength(0);
  });

  it("rejeita quando a categoria não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando a categoria está em uso por algum kit", async () => {
    const category = await ctx.categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });
    const kitType = await ctx.kitTypesRepository.create({
      name: "Kit de Mesa",
      slug: "kit-de-mesa",
      price: 100,
    });
    await ctx.kitsRepository.create({
      name: "Kit Princesa",
      slug: "kit-princesa",
      description: "Tema princesa completo",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await expect(() =>
      sut.execute({ id: String(category.id) }),
    ).rejects.toBeInstanceOf(ResourceInUseError);
    expect(ctx.categoriesRepository.items).toHaveLength(1);
  });
});
