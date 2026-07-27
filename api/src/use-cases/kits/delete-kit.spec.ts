import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { FakeCloudinaryProvider } from "../../test/fakes/fake-cloudinary-provider";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteKitUseCase } from "./delete-kit";

describe("DeleteKitUseCase", () => {
  let ctx: KitContext;
  let cloudinary: FakeCloudinaryProvider;
  let sut: DeleteKitUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    cloudinary = new FakeCloudinaryProvider();
    sut = new DeleteKitUseCase(
      ctx.kitsRepository,
      ctx.kitImagesRepository,
      cloudinary,
    );
  });

  it("remove o kit e limpa todas as imagens no Cloudinary", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "kits/festa-da-minnie/a",
      isPrimary: true,
      order: 0,
    });
    await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/b.png",
      publicId: "kits/festa-da-minnie/b",
      order: 1,
    });

    await sut.execute({ id: String(kit.id) });

    expect(ctx.kitsRepository.records).toHaveLength(0);
    expect(ctx.kitImagesRepository.items).toHaveLength(0);
    expect(cloudinary.deletions).toEqual(
      expect.arrayContaining([
        "kits/festa-da-minnie/a",
        "kits/festa-da-minnie/b",
      ]),
    );
  });

  it("não falha se o Cloudinary não conseguir apagar (allSettled)", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa Frozen",
      slug: "festa-frozen",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });

    await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "kits/festa-frozen/a",
    });

    cloudinary.deleteShouldFail = true;

    await expect(sut.execute({ id: String(kit.id) })).resolves.toBeUndefined();
    expect(ctx.kitsRepository.records).toHaveLength(0);
  });

  it("rejeita quando o kit não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
