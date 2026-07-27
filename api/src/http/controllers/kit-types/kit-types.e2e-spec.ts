import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { setupE2E, type E2EContext } from "../../../test/make-e2e-app";

describe("Kit Types E2E", () => {
  let ctx: E2EContext;

  beforeEach(async () => {
    ctx = await setupE2E();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  it("POST /kit-types sem token retorna 401", async () => {
    const response = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      payload: { name: "Kit de Mesa" },
    });
    expect(response.statusCode).toBe(401);
  });

  it("POST /kit-types com slug duplicado retorna 409", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const first = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      headers: { cookie },
      payload: { name: "Kit de Mesa", price: 150 },
    });
    expect(first.statusCode).toBe(201);

    const dup = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      headers: { cookie },
      payload: { name: "Kit de Mesa", price: 150 },
    });
    expect(dup.statusCode).toBe(409);
  });

  it("POST /kit-types cria com preço e itens do catálogo; GET lista ambos", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    // cria os itens no catálogo via API
    const arcoResponse = await ctx.app.inject({
      method: "POST",
      url: "/items",
      headers: { cookie },
      payload: { name: "Arco de balões" },
    });
    expect(arcoResponse.statusCode).toBe(201);
    const arcoId = (arcoResponse.json() as { item: { id: string } }).item.id;

    const panoResponse = await ctx.app.inject({
      method: "POST",
      url: "/items",
      headers: { cookie },
      payload: { name: "Pano de mesa" },
    });
    const panoId = (panoResponse.json() as { item: { id: string } }).item.id;

    const created = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      headers: { cookie },
      payload: {
        name: "Kit Básico",
        price: 199.9,
        items: [
          { itemId: arcoId, quantity: 1 },
          { itemId: panoId, quantity: 2 },
        ],
      },
    });
    expect(created.statusCode).toBe(201);

    const list = await ctx.app.inject({ method: "GET", url: "/kit-types" });
    const body = list.json() as {
      kitTypes: {
        slug: string;
        price: number;
        items: { itemId: string; name: string; quantity: number | null }[];
      }[];
    };
    const basico = body.kitTypes.find((t) => t.slug === "kit-basico");
    expect(basico).toBeDefined();
    expect(basico!.price).toBe(199.9);
    expect(basico!.items.map((i) => i.name)).toEqual([
      "Arco de balões",
      "Pano de mesa",
    ]);
  });

  it("DELETE /items bloqueia item em uso por um tipo (409)", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const arco = await ctx.catalogItems.create({ name: "Arco de balões" });
    await ctx.kitTypes.create({
      name: "Kit Básico",
      slug: "kit-basico",
      price: 100,
      items: [{ itemId: String(arco.id), quantity: 1 }],
    });

    const blocked = await ctx.app.inject({
      method: "DELETE",
      url: `/items/${String(arco.id)}`,
      headers: { cookie },
    });
    expect(blocked.statusCode).toBe(409);
  });

  it("POST /kit-types sem preço retorna 400", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const response = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      headers: { cookie },
      payload: { name: "Kit Sem Preço" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("GET /kit-types é público (sem token retorna 200)", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/kit-types",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as { kitTypes: unknown[] };
    expect(Array.isArray(body.kitTypes)).toBe(true);
  });

  it("POST /kit-types com user role USER retorna 403", async () => {
    const { hash } = await import("bcryptjs");
    await ctx.users.create({
      name: "User normal",
      email: "user@contos.test",
      passwordHash: await hash("senha-forte-123", 6),
      role: "USER",
    });

    const { cookie } = await ctx.loginAs("user@contos.test", "senha-forte-123");

    const response = await ctx.app.inject({
      method: "POST",
      url: "/kit-types",
      headers: { cookie },
      payload: { name: "Kit Tentativa", price: 100 },
    });
    expect(response.statusCode).toBe(403);
  });
});
