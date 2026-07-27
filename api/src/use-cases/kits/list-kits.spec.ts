import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ListKitsUseCase } from "./list-kits";

describe("ListKitsUseCase", () => {
  let ctx: KitContext;
  let sut: ListKitsUseCase;

  beforeEach(async () => {
    ctx = makeKitContext();
    sut = new ListKitsUseCase(ctx.kitsRepository);

    const mesa = await ctx.kitTypesRepository.create({
      name: "Kit de Mesa",
      slug: "kit-de-mesa",
      price: 100,
    });
    const kit1 = await ctx.kitTypesRepository.create({
      name: "Kit 1",
      slug: "kit-1",
      price: 100,
    });
    const aniversario = await ctx.categoriesRepository.create({
      name: "Aniversário",
      slug: "aniversario",
    });
    const cha = await ctx.categoriesRepository.create({
      name: "Chá de Bebê",
      slug: "cha-de-bebe",
    });

    await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "Kit Minnie clássico",
      featured: true,
      kitTypeId: String(mesa.id),
      categoryId: String(aniversario.id),
    });
    await ctx.kitsRepository.create({
      name: "Kit Príncipe",
      slug: "kit-principe",
      description: "Para chá de bebê do menino",
      featured: false,
      kitTypeId: String(kit1.id),
      categoryId: String(cha.id),
    });
    await ctx.kitsRepository.create({
      name: "Festa Frozen",
      slug: "festa-frozen",
      description: "Tema Frozen elegante",
      featured: true,
      kitTypeId: String(mesa.id),
      categoryId: String(aniversario.id),
    });
  });

  it("retorna todos os kits cadastrados quando sem filtros", async () => {
    const { kits } = await sut.execute();
    expect(kits).toHaveLength(3);
  });

  it("filtra apenas os kits em destaque", async () => {
    const { kits } = await sut.execute({ featured: true });
    expect(kits).toHaveLength(2);
    expect(kits.every((kit) => kit.featured)).toBe(true);
  });

  it("filtra por slug do tipo de kit", async () => {
    const { kits } = await sut.execute({ kitTypeSlug: "kit-de-mesa" });
    expect(kits).toHaveLength(2);
    expect(kits.every((kit) => kit.kitType.slug === "kit-de-mesa")).toBe(true);
  });

  it("filtra por slug da categoria", async () => {
    const { kits } = await sut.execute({ categorySlug: "cha-de-bebe" });
    expect(kits).toHaveLength(1);
    expect(kits[0].slug).toBe("kit-principe");
  });

  it("busca por termo no nome ou descrição (case-insensitive)", async () => {
    const { kits } = await sut.execute({ search: "frozen" });
    expect(kits).toHaveLength(1);
    expect(kits[0].slug).toBe("festa-frozen");

    const { kits: byDescription } = await sut.execute({ search: "MENINO" });
    expect(byDescription.map((kit) => kit.slug)).toEqual(["kit-principe"]);
  });

  it("combina múltiplos filtros (featured + categoria)", async () => {
    const { kits } = await sut.execute({
      featured: true,
      categorySlug: "aniversario",
    });
    expect(kits).toHaveLength(2);
  });

  it("aplica paginação com page/pageSize", async () => {
    const first = await sut.execute({ pageSize: 2 });
    expect(first.kits).toHaveLength(2);
    expect(first.total).toBe(3);
    expect(first.page).toBe(1);
    expect(first.pageSize).toBe(2);

    const second = await sut.execute({ page: 2, pageSize: 2 });
    expect(second.kits).toHaveLength(1);
    expect(second.total).toBe(3);
    expect(second.page).toBe(2);
  });
});
