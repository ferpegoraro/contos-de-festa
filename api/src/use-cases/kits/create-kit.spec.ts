import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { CreateKitUseCase } from "./create-kit";

describe("CreateKitUseCase", () => {
  let ctx: KitContext;
  let sut: CreateKitUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new CreateKitUseCase(
      ctx.kitsRepository,
      ctx.kitTypesRepository,
      ctx.categoriesRepository,
    );
  });

  it("cria um kit que herda preço e itens do tipo", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);

    const { kit } = await sut.execute({
      name: "Festa da Minnie",
      description: "Kit completo de mesa com tema da Minnie.",
      shortDescription: "Tema Minnie clássico",
      featured: true,
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    expect(kit.slug).toBe("festa-da-minnie");
    expect(kit.featured).toBe(true);
    // herda do tipo (seed: price 150, item "Arco de balões")
    expect(kit.priceOverride).toBeNull();
    expect(kit.price).toBe(150);
    expect(kit.kitType.items.map((item) => item.name)).toEqual([
      "Arco de balões",
    ]);
    expect(kit.kitType.slug).toBe("kit-de-mesa");
    expect(kit.category.slug).toBe("aniversario");
  });

  it("com priceOverride, o preço efetivo é o promocional", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);

    const { kit } = await sut.execute({
      name: "Kit Promo",
      description: "desc",
      priceOverride: 99.9,
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    expect(kit.priceOverride).toBe(99.9);
    expect(kit.price).toBe(99.9);
  });

  it("normaliza o slug informado pelo usuário", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);

    const { kit } = await sut.execute({
      name: "Kit Frozen",
      slug: "Kit Frozen Especial",
      description: "Kit Frozen para festas infantis.",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    expect(kit.slug).toBe("kit-frozen-especial");
    expect(kit.featured).toBe(false);
    expect(kit.shortDescription).toBeNull();
  });

  it("rejeita quando o tipo de kit não existe", async () => {
    const { category } = await seedKitTypeAndCategory(ctx);

    await expect(() =>
      sut.execute({
        name: "Kit qualquer",
        description: "desc",
        kitTypeId: "tipo-inexistente",
        categoryId: String(category.id),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando a categoria não existe", async () => {
    const { kitType } = await seedKitTypeAndCategory(ctx);

    await expect(() =>
      sut.execute({
        name: "Kit qualquer",
        description: "desc",
        kitTypeId: String(kitType.id),
        categoryId: "categoria-inexistente",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando já existe kit com o mesmo slug", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);

    await sut.execute({
      name: "Festa da Minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await expect(() =>
      sut.execute({
        name: "festa-da-minnie",
        description: "desc",
        kitTypeId: String(kitType.id),
        categoryId: String(category.id),
      }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);
  });
});
