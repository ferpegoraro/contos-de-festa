import { describe, expect, it } from "vitest";
import { KitItem } from "./kit-item";

const ARCO_ID = "11111111-1111-1111-1111-111111111111";
const PANO_ID = "22222222-2222-2222-2222-222222222222";

describe("KitItem (Value Object)", () => {
  it("compara por valor: mesmo item + quantity são iguais", () => {
    const a = KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: 2 });
    const b = KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: 2 });

    expect(a.equals(b)).toBe(true);
  });

  it("item ou quantity diferentes não são iguais", () => {
    const base = KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: 1 });

    expect(
      base.equals(KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: 2 })),
    ).toBe(false);
    expect(
      base.equals(KitItem.create({ itemId: PANO_ID, name: "Pano", quantity: 1 })),
    ).toBe(false);
  });

  it("quantity omitida vira null", () => {
    const item = KitItem.create({ itemId: ARCO_ID, name: "Arco" });

    expect(item.quantity).toBeNull();
    expect(
      item.equals(
        KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: null }),
      ),
    ).toBe(true);
  });

  it("serializa sem id próprio (não tem identidade)", () => {
    const item = KitItem.create({ itemId: ARCO_ID, name: "Arco", quantity: 3 });

    expect(item.toJSON()).toEqual({
      itemId: ARCO_ID,
      name: "Arco",
      quantity: 3,
    });
  });
});
