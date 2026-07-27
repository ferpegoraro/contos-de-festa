import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryItemsRepository } from "../../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitTypesRepository } from "../../repositories/in-memory/in-memory-kit-types-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { UpdateKitTypeUseCase } from "./update-kit-type";

describe("UpdateKitTypeUseCase", () => {
  let itemsRepository: InMemoryItemsRepository;
  let kitTypesRepository: InMemoryKitTypesRepository;
  let sut: UpdateKitTypeUseCase;

  beforeEach(() => {
    itemsRepository = new InMemoryItemsRepository();
    kitTypesRepository = new InMemoryKitTypesRepository(itemsRepository);
    sut = new UpdateKitTypeUseCase(kitTypesRepository, itemsRepository);
  });

  it("atualiza nome e regenera slug quando slug não é informado", async () => {
    const created = await kitTypesRepository.create({
      name: "Kit 1",
      slug: "kit-1",
      price: 100,
    });

    const { kitType } = await sut.execute({
      id: String(created.id),
      name: "Kit 1 Premium",
    });

    expect(kitType.name).toBe("Kit 1 Premium");
    expect(kitType.slug).toBe("kit-1-premium");
  });

  it("atualiza preço e substitui a lista inteira de itens", async () => {
    const arco = await itemsRepository.create({ name: "Arco de balões" });
    const pano = await itemsRepository.create({ name: "Pano de mesa" });
    const created = await kitTypesRepository.create({
      name: "Kit Básico",
      slug: "kit-basico",
      price: 100,
      items: [{ itemId: String(arco.id), quantity: 1 }],
    });

    const { kitType } = await sut.execute({
      id: String(created.id),
      price: 250,
      items: [{ itemId: String(pano.id), quantity: 3 }],
    });

    expect(kitType.price).toBe(250);
    expect(kitType.items).toHaveLength(1);
    expect(kitType.items[0].name).toBe("Pano de mesa");
    expect(kitType.items[0].quantity).toBe(3);
  });

  it("rejeita item inexistente no catálogo", async () => {
    const created = await kitTypesRepository.create({
      name: "Kit 1",
      slug: "kit-1",
      price: 100,
    });

    await expect(() =>
      sut.execute({
        id: String(created.id),
        items: [{ itemId: "item-fantasma", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("rejeita quando slug já está em uso por outro tipo", async () => {
    await kitTypesRepository.create({ name: "Kit de Mesa", slug: "kit-de-mesa", price: 100 });
    const target = await kitTypesRepository.create({
      name: "Kit 1",
      slug: "kit-1",
      price: 100,
    });

    await expect(() =>
      sut.execute({ id: String(target.id), slug: "kit-de-mesa" }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);
  });

  it("rejeita quando o tipo não existe", async () => {
    await expect(() =>
      sut.execute({ id: "nao-existe", name: "X" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
