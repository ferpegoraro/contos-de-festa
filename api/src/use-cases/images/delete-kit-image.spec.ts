import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { FakeCloudinaryProvider } from "../../test/fakes/fake-cloudinary-provider";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteKitImageUseCase } from "./delete-kit-image";

describe("DeleteKitImageUseCase", () => {
  let ctx: KitContext;
  let cloudinary: FakeCloudinaryProvider;
  let sut: DeleteKitImageUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    cloudinary = new FakeCloudinaryProvider();
    sut = new DeleteKitImageUseCase(ctx.kitImagesRepository, cloudinary);
  });

  it("remove a imagem do repositório e do Cloudinary", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });
    const image = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "kits/festa-da-minnie/a",
    });

    await sut.execute({
      kitId: String(kit.id),
      imageId: String(image.id),
    });

    expect(ctx.kitImagesRepository.items).toHaveLength(0);
    expect(cloudinary.deletions).toEqual(["kits/festa-da-minnie/a"]);
  });

  it("ignora falhas no Cloudinary (best-effort)", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });
    const image = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "kits/festa-da-minnie/a",
    });

    cloudinary.deleteShouldFail = true;

    await expect(
      sut.execute({ kitId: String(kit.id), imageId: String(image.id) }),
    ).resolves.toBeUndefined();
    expect(ctx.kitImagesRepository.items).toHaveLength(0);
  });

  it("rejeita quando a imagem não existe", async () => {
    await expect(() =>
      sut.execute({ kitId: "kit-x", imageId: "img-fantasma" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando a imagem pertence a outro kit", async () => {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });
    const image = await ctx.kitImagesRepository.create({
      kitId: String(kit.id),
      url: "https://img/a.png",
      publicId: "kits/festa-da-minnie/a",
    });

    await expect(() =>
      sut.execute({ kitId: "outro-kit", imageId: String(image.id) }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
