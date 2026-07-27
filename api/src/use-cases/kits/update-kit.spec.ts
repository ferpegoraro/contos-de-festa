import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { UpdateKitUseCase } from "./update-kit";

describe("UpdateKitUseCase", () => {
  let ctx: KitContext;
  let sut: UpdateKitUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new UpdateKitUseCase(
      ctx.kitsRepository,
      ctx.kitTypesRepository,
      ctx.categoriesRepository,
    );
  });

  it("atualiza os campos básicos de um kit existente", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const created = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "antiga",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    const { kit } = await sut.execute({
      id: String(created.id),
      name: "Festa da Minnie Premium",
      featured: true,
    });

    expect(kit.name).toBe("Festa da Minnie Premium");
    expect(kit.featured).toBe(true);
    expect(kit.slug).toBe("festa-da-minnie-premium");
  });

  it("define preço promocional e depois limpa (volta a herdar do tipo)", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const created = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    // seed: tipo custa 150
    expect(created.price).toBe(150);

    const { kit: promo } = await sut.execute({
      id: String(created.id),
      priceOverride: 99,
    });
    expect(promo.priceOverride).toBe(99);
    expect(promo.price).toBe(99);

    const { kit: backToType } = await sut.execute({
      id: String(created.id),
      priceOverride: null,
    });
    expect(backToType.priceOverride).toBeNull();
    expect(backToType.price).toBe(150);
  });

  it("rejeita quando o kit não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe", name: "X" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando o novo tipo de kit não existe", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const created = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await expect(() =>
      sut.execute({
        id: String(created.id),
        kitTypeId: "tipo-fantasma",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando a nova categoria não existe", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const created = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await expect(() =>
      sut.execute({
        id: String(created.id),
        categoryId: "categoria-fantasma",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando o novo slug já existe em outro kit", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    await ctx.kitsRepository.create({
      name: "Festa Frozen",
      slug: "festa-frozen",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });
    const target = await ctx.kitsRepository.create({
      name: "Festa Minnie",
      slug: "festa-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await expect(() =>
      sut.execute({
        id: String(target.id),
        slug: "festa-frozen",
      }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);
  });

  it("ao trocar o tipo do kit, o preço herdado acompanha", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const premium = await ctx.kitTypesRepository.create({
      name: "Kit Premium",
      slug: "kit-premium",
      price: 500,
    });
    const created = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    const { kit } = await sut.execute({
      id: String(created.id),
      kitTypeId: String(premium.id),
    });

    expect(kit.price).toBe(500);
  });
});
