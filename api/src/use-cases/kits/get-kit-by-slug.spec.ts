import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { GetKitBySlugUseCase } from "./get-kit-by-slug";

describe("GetKitBySlugUseCase", () => {
  let ctx: KitContext;
  let sut: GetKitBySlugUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new GetKitBySlugUseCase(ctx.kitsRepository);
  });

  it("retorna o kit pelo slug com tipo, categoria e preço/itens herdados", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "Kit Minnie",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    const { kit } = await sut.execute({ slug: "festa-da-minnie" });

    expect(kit.name).toBe("Festa da Minnie");
    expect(kit.kitType.slug).toBe("kit-de-mesa");
    expect(kit.category.slug).toBe("aniversario");
    // herdados do tipo (seed: price 150 + 1 item)
    expect(kit.price).toBe(150);
    expect(kit.kitType.items).toHaveLength(1);
  });

  it("rejeita quando o slug não corresponde a nenhum kit", async () => {
    await expect(() =>
      sut.execute({ slug: "kit-inexistente" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
