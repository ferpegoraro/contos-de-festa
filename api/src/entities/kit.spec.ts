import { describe, expect, it } from "vitest";
import { Category } from "./category";
import { Kit } from "./kit";
import { KitItem } from "./kit-item";
import { KitType } from "./kit-type";

function makeKit(priceOverride: number | null) {
  const kitType = KitType.create({
    name: "Kit Básico",
    slug: "kit-basico",
    price: 150,
    items: [
      KitItem.create({
        itemId: "11111111-1111-1111-1111-111111111111",
        name: "Arco",
        quantity: 1,
      }),
    ],
  });
  const category = Category.create({
    name: "Aniversário",
    slug: "aniversario",
  });
  return Kit.create({
    name: "Kit Princesa",
    slug: "kit-princesa",
    description: "desc",
    priceOverride,
    kitTypeId: kitType.id.toString(),
    categoryId: category.id.toString(),
    kitType,
    category,
  });
}

describe("Kit — preço efetivo", () => {
  it("sem override, herda o preço do tipo", () => {
    expect(makeKit(null).price).toBe(150);
  });

  it("com override, usa o preço promocional", () => {
    expect(makeKit(99.9).price).toBe(99.9);
  });

  it("serializa o preço efetivo no toJSON", () => {
    const json = makeKit(null).toJSON() as {
      price: number;
      priceOverride: number | null;
    };
    expect(json.price).toBe(150);
    expect(json.priceOverride).toBeNull();
  });

  it("itens inclusos vêm do tipo", () => {
    const kit = makeKit(null);
    expect(kit.kitType.items.map((i) => i.name)).toEqual(["Arco"]);
  });
});
