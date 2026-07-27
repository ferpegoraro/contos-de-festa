import { beforeEach, describe, expect, it } from "vitest";
import type { KitImage } from "../../entities/kit-image";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { ReorderKitImagesUseCase } from "./reorder-kit-images";

describe("ReorderKitImagesUseCase", () => {
  let ctx: KitContext;
  let sut: ReorderKitImagesUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    sut = new ReorderKitImagesUseCase(
      ctx.kitsRepository,
      ctx.kitImagesRepository,
    );
  });

  async function setupKitWithImages(): Promise<{ kitId: string; images: KitImage[] }> {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    const a = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "a",
      isPrimary: true,
      order: 0,
    });
    const b = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/b.png",
      publicId: "b",
      order: 1,
    });
    const c = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/c.png",
      publicId: "c",
      order: 2,
    });

    return { kitId: String(kit.id), images: [a, b, c] };
  }

  it("reordena as imagens e atualiza qual é a principal", async () => {
    const { kitId, images } = await setupKitWithImages();
    const [a, b, c] = images;

    const { images: result } = await sut.execute({
      kitId,
      items: [
        { id: String(b.id), order: 0, isPrimary: true },
        { id: String(c.id), order: 1 },
        { id: String(a.id), order: 2 },
      ],
    });

    expect(result).toHaveLength(3);
    const primaries = result.filter((image) => image.isPrimary);
    expect(primaries).toHaveLength(1);
    expect(String(primaries[0].id)).toBe(String(b.id));

    const ordered = [...result].sort((x, y) => x.order - y.order);
    expect(ordered.map((image) => String(image.id))).toEqual([
      String(b.id),
      String(c.id),
      String(a.id),
    ]);
  });

  it("rejeita quando o kit não existe", async () => {
    await expect(() =>
      sut.execute({ kitId: "kit-fantasma", items: [] }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando alguma imagem informada não pertence ao kit", async () => {
    const { kitId, images } = await setupKitWithImages();

    await expect(() =>
      sut.execute({
        kitId,
        items: [
          { id: String(images[0].id), order: 0, isPrimary: true },
          { id: "imagem-fantasma", order: 1 },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
