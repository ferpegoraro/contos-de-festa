import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryItemsRepository } from "../../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitTypesRepository } from "../../repositories/in-memory/in-memory-kit-types-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../errors/slug-already-exists-error";
import { CreateKitTypeUseCase } from "./create-kit-type";

describe("CreateKitTypeUseCase", () => {
  let itemsRepository: InMemoryItemsRepository;
  let kitTypesRepository: InMemoryKitTypesRepository;
  let sut: CreateKitTypeUseCase;

  beforeEach(() => {
    itemsRepository = new InMemoryItemsRepository();
    kitTypesRepository = new InMemoryKitTypesRepository(itemsRepository);
    sut = new CreateKitTypeUseCase(kitTypesRepository, itemsRepository);
  });

  it("cria um tipo de kit gerando o slug a partir do nome", async () => {
    const { kitType } = await sut.execute({ name: "Kit de Mesa", price: 150 });

    expect(kitType.name).toBe("Kit de Mesa");
    expect(kitType.slug).toBe("kit-de-mesa");
    expect(kitType.price).toBe(150);
    expect(kitTypesRepository.items).toHaveLength(1);
  });

  it("cria com itens do catálogo; sem itens vira lista vazia", async () => {
    const arco = await itemsRepository.create({ name: "Arco de balões" });
    const pano = await itemsRepository.create({ name: "Pano de mesa" });

    const { kitType } = await sut.execute({
      name: "Kit Básico",
      price: 200,
      items: [
        { itemId: String(arco.id), quantity: 1 },
        { itemId: String(pano.id), quantity: 2 },
      ],
    });

    expect(kitType.items.map((item) => item.name)).toEqual([
      "Arco de balões",
      "Pano de mesa",
    ]);
    expect(kitType.items.map((item) => item.itemId)).toEqual([
      String(arco.id),
      String(pano.id),
    ]);

    const { kitType: semItens } = await sut.execute({
      name: "Kit Vazio",
      price: 50,
    });
    expect(semItens.items).toEqual([]);
  });

  it("rejeita item que não existe no catálogo", async () => {
    await expect(() =>
      sut.execute({
        name: "Kit Quebrado",
        price: 100,
        items: [{ itemId: "item-fantasma", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("normaliza o slug informado explicitamente", async () => {
    const { kitType } = await sut.execute({
      name: "Kit 1",
      slug: "Kit Número 1",
      price: 100,
    });

    expect(kitType.slug).toBe("kit-numero-1");
  });

  it("rejeita quando já existe tipo com o mesmo slug", async () => {
    await sut.execute({ name: "Kit de Mesa", price: 100 });

    await expect(() =>
      sut.execute({ name: "kit-de-mesa", price: 100 }),
    ).rejects.toBeInstanceOf(SlugAlreadyExistsError);
  });
});
