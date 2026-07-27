import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("normaliza acentos para ASCII", () => {
    expect(slugify("Aniversário")).toBe("aniversario");
    expect(slugify("Chá de Bebê")).toBe("cha-de-bebe");
  });

  it("converte espaços em hífens e baixa caixa", () => {
    expect(slugify("Kit de Mesa")).toBe("kit-de-mesa");
  });

  it("remove caracteres especiais", () => {
    expect(slugify("Festa @ 2026!")).toBe("festa-2026");
  });

  it("colapsa múltiplos espaços e hífens consecutivos", () => {
    expect(slugify("Kit   1 -- especial")).toBe("kit-1-especial");
  });

  it("apara espaços nas extremidades", () => {
    expect(slugify("   Minnie Mouse   ")).toBe("minnie-mouse");
  });

  it("retorna string vazia para entradas vazias", () => {
    expect(slugify("")).toBe("");
    expect(slugify("    ")).toBe("");
  });
});
