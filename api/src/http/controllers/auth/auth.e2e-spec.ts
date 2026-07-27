import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { setupE2E, type E2EContext } from "../../../test/make-e2e-app";

describe("Auth E2E", () => {
  let ctx: E2EContext;

  beforeEach(async () => {
    ctx = await setupE2E();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  it("POST /auth/login retorna 200 com token e seta cookie httpOnly", async () => {
    const admin = await ctx.seedAdmin();

    const response = await ctx.app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: admin.email, password: admin.password },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { token: string; user: { role: string } };
    expect(body.token).toEqual(expect.any(String));
    expect(body.user.role).toBe("ADMIN");

    const cookieHeader = response.headers["set-cookie"];
    const cookie = Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader;
    expect(cookie).toContain("contos_token=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("POST /auth/login com senha errada retorna 401", async () => {
    const admin = await ctx.seedAdmin();

    const response = await ctx.app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: admin.email, password: "senha-errada-1" },
    });

    expect(response.statusCode).toBe(401);
  });

  it("POST /auth/login com email inexistente retorna 401 (mesma mensagem genérica)", async () => {
    const response = await ctx.app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "ninguem@contos.test", password: "qualquer-coisa-1" },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json() as { message: string };
    expect(body.message).toMatch(/credenciais/i);
  });

  it("GET /auth/me sem cookie/token retorna 401", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/auth/me",
    });
    expect(response.statusCode).toBe(401);
  });

  it("GET /auth/me com cookie httpOnly retorna o usuário logado", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const response = await ctx.app.inject({
      method: "GET",
      url: "/auth/me",
      headers: { cookie },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { user: { email: string; role: string } };
    expect(body.user.email).toBe(admin.email);
    expect(body.user.role).toBe("ADMIN");
  });

  it("POST /auth/logout limpa o cookie", async () => {
    const admin = await ctx.seedAdmin();
    const { cookie } = await ctx.loginAs(admin.email, admin.password);

    const response = await ctx.app.inject({
      method: "POST",
      url: "/auth/logout",
      headers: { cookie },
    });

    expect(response.statusCode).toBe(204);
    const setCookie = response.headers["set-cookie"];
    const value = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    expect(value).toContain("contos_token=");
    expect(value).toContain("Expires=");
  });
});
