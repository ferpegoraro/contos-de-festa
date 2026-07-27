import { beforeEach, describe, expect, it } from "vitest";
import {
  makeKitContext,
  seedKitTypeAndCategory,
  type KitContext,
} from "../../test/factories/make-kit-context";
import { FakeCloudinaryProvider } from "../../test/fakes/fake-cloudinary-provider";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UploadKitImageUseCase } from "./upload-kit-image";

describe("UploadKitImageUseCase", () => {
  let ctx: KitContext;
  let cloudinary: FakeCloudinaryProvider;
  let sut: UploadKitImageUseCase;

  beforeEach(() => {
    ctx = makeKitContext();
    cloudinary = new FakeCloudinaryProvider();
    sut = new UploadKitImageUseCase(
      ctx.kitsRepository,
      ctx.kitImagesRepository,
      cloudinary,
    );
  });

  async function setupKit() {
    const { kitType, category } = await seedKitTypeAndCategory(ctx);
    const kit = await ctx.kitsRepository.create({
      name: "Festa da Minnie",
      slug: "festa-da-minnie",
      description: "desc",
      kitTypeId: String(kitType.id),
      categoryId: String(category.id),
    });
    return kit;
  }

  it("a primeira imagem do kit é marcada como principal automaticamente", async () => {
    const kit = await setupKit();

    const { image } = await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("fake-bytes"),
      filename: "foto.png",
      mimetype: "image/png",
    });

    expect(image.isPrimary).toBe(true);
    expect(image.order).toBe(0);
    expect(image.alt).toBe(kit.name);
    expect(cloudinary.uploads).toHaveLength(1);
    expect(cloudinary.uploads[0].folder).toBe(
      "contos-de-festas/kits/festa-da-minnie",
    );
  });

  it("imagens subsequentes não são principais por padrão e ganham order incremental", async () => {
    const kit = await setupKit();

    await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("a"),
      filename: "a.png",
      mimetype: "image/png",
    });
    const { image: second } = await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("b"),
      filename: "b.png",
      mimetype: "image/png",
    });

    expect(second.isPrimary).toBe(false);
    expect(second.order).toBe(1);
  });

  it("quando isPrimary=true em imagem subsequente, desmarca a anterior", async () => {
    const kit = await setupKit();

    const { image: first } = await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("a"),
      filename: "a.png",
      mimetype: "image/png",
    });

    expect(first.isPrimary).toBe(true);

    const { image: second } = await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("b"),
      filename: "b.png",
      mimetype: "image/png",
      isPrimary: true,
    });

    expect(second.isPrimary).toBe(true);

    const all = await ctx.kitImagesRepository.listByKitId(String(kit.id));
    const primaries = all.filter((image) => image.isPrimary);
    expect(primaries).toHaveLength(1);
    expect(String(primaries[0].id)).toBe(String(second.id));
  });

  it("usa o alt informado quando presente", async () => {
    const kit = await setupKit();

    const { image } = await sut.execute({
      kitId: String(kit.id),
      fileBuffer: Buffer.from("a"),
      filename: "a.png",
      mimetype: "image/png",
      alt: "Mesa decorada com tema da Minnie",
    });

    expect(image.alt).toBe("Mesa decorada com tema da Minnie");
  });

  it("rejeita upload quando o kit não existe", async () => {
    await expect(() =>
      sut.execute({
        kitId: "kit-fantasma",
        fileBuffer: Buffer.from("a"),
        filename: "a.png",
        mimetype: "image/png",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    expect(cloudinary.uploads).toHaveLength(0);
  });
});
