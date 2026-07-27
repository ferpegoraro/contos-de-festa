import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { setupE2E, type E2EContext } from "../../../test/make-e2e-app";

describe("Kits E2E", () => {
  let ctx: E2EContext;

  beforeEach(async () => {
    ctx = await setupE2E();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  it("POST /kits sem token retorna 401", async () => {
    const response = await ctx.app.inject({
      method: "POST",
      url: "/kits",
      payload: {
        name: "Kit X",
        description: "desc",
        kitTypeId: "any",
        categoryId: "any",
      },
    });
    expect(response.statusCode).toBe(401);
  });

  it("POST /kits com kitTypeId inexistente retorna 404", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const category = await ctx.categories.create({
      name: "Aniversário",
      slug: "aniversario",
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/kits",
      headers: { cookie },
      payload: {
        name: "Kit Princesa",
        description: "Tema princesa completo",
        kitTypeId: "00000000-0000-0000-0000-000000000000",
        categoryId: String(category.id),
      },
    });
    expect(response.statusCode).toBe(404);
  });

  it("POST /kits com categoryId inexistente retorna 404", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const kitType = await ctx.kitTypes.create({
      name: "Kit de Mesa",
      slug: "kit-de-mesa",
      price: 150,
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/kits",
      headers: { cookie },
      payload: {
        name: "Kit Princesa",
        description: "Tema princesa completo",
        kitTypeId: String(kitType.id),
        categoryId: "00000000-0000-0000-0000-000000000000",
      },
    });
    expect(response.statusCode).toBe(404);
  });

  it("POST /kits sem override herda preço e itens do tipo na resposta", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const arco = await ctx.catalogItems.create({ name: "Arco de balões" });
    const kitType = await ctx.kitTypes.create({
      name: "Kit Básico",
      slug: "kit-basico",
      price: 199.9,
      items: [{ itemId: String(arco.id), quantity: 1 }],
    });
    const category = await ctx.categories.create({
      name: "Aniversário",
      slug: "aniversario",
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/kits",
      headers: { cookie },
      payload: {
        name: "Kit Princesa",
        description: "Tema princesa completo",
        kitTypeId: String(kitType.id),
        categoryId: String(category.id),
      },
    });
    expect(response.statusCode).toBe(201);

    const body = response.json() as {
      kit: {
        price: number;
        priceOverride: number | null;
        kitType: { items: { name: string }[] };
      };
    };
    expect(body.kit.priceOverride).toBeNull();
    expect(body.kit.price).toBe(199.9);
    expect(body.kit.kitType.items.map((i) => i.name)).toEqual([
      "Arco de balões",
    ]);

    // com override, o preço efetivo muda
    const promo = await ctx.app.inject({
      method: "POST",
      url: "/kits",
      headers: { cookie },
      payload: {
        name: "Kit Safari",
        description: "Tema safari completo",
        priceOverride: 149.9,
        kitTypeId: String(kitType.id),
        categoryId: String(category.id),
      },
    });
    expect(promo.statusCode).toBe(201);
    expect((promo.json() as { kit: { price: number } }).kit.price).toBe(149.9);
  });

  it("GET /kits é público, pagina e manda Cache-Control (blinda pico)", async () => {
    const response = await ctx.app.inject({ method: "GET", url: "/kits" });
    expect(response.statusCode).toBe(200);
    // cache pra CDN/proxy absorver tráfego e poupar o backend
    expect(response.headers["cache-control"]).toContain("s-maxage");
    const body = response.json() as {
      kits: unknown[];
      total: number;
      page: number;
      pageSize: number;
    };
    expect(body.total).toBe(0);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(24);
  });
});
