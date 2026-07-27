import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteKitTypeUseCase } from "./delete-kit-type";

describe("DeleteKitTypeUseCase", () => {
  let ctx: KitContext;
  let sut: DeleteKitTypeUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new DeleteKitTypeUseCase(ctx.kitTypesRepository, ctx.kitsRepository);
  });

  it("remove o tipo de kit existente quando não há kits vinculados", async () => {
    const created = await ctx.kitTypesRepository.create({
      name: "Kit de Mesa",
      slug: "kit-de-mesa",
      price: 100,
    });

    await sut.execute({ id: String(created.id) });
    expect(ctx.kitTypesRepository.items).toHaveLength(0);
  });

  it("rejeita quando o tipo não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando o tipo está em uso por algum kit", async () => {
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
      sut.execute({ id: String(kitType.id) }),
    ).rejects.toBeInstanceOf(ResourceInUseError);
    expect(ctx.kitTypesRepository.items).toHaveLength(1);
  });
});
