import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryItemsRepository } from "../../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitTypesRepository } from "../../repositories/in-memory/in-memory-kit-types-repository";
import { ItemAlreadyExistsError } from "../errors/item-already-exists-error";
import { ResourceInUseError } from "../errors/resource-in-use-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { CreateItemUseCase } from "./create-item";
import { DeleteItemUseCase } from "./delete-item";
import { ListItemsUseCase } from "./list-items";
import { UpdateItemUseCase } from "./update-item";

describe("Items (catálogo)", () => {
  let itemsRepository: InMemoryItemsRepository;
  let kitTypesRepository: InMemoryKitTypesRepository;

  beforeEach(() => {
    itemsRepository = new InMemoryItemsRepository();
    kitTypesRepository = new InMemoryKitTypesRepository(itemsRepository);
  });

  describe("CreateItemUseCase", () => {
    it("cria um item com nome trimado", async () => {
      const sut = new CreateItemUseCase(itemsRepository);
      const { item } = await sut.execute({ name: "  Arco de balões  " });

      expect(item.name).toBe("Arco de balões");
      expect(itemsRepository.items).toHaveLength(1);
    });

    it("rejeita nome duplicado", async () => {
      const sut = new CreateItemUseCase(itemsRepository);
      await sut.execute({ name: "Arco de balões" });

      await expect(() =>
        sut.execute({ name: "Arco de balões" }),
      ).rejects.toBeInstanceOf(ItemAlreadyExistsError);
    });
  });

  describe("ListItemsUseCase", () => {
    it("lista ordenado por nome", async () => {
      await itemsRepository.create({ name: "Pano" });
      await itemsRepository.create({ name: "Arco" });

      const sut = new ListItemsUseCase(itemsRepository);
      const { items } = await sut.execute();

      expect(items.map((i) => i.name)).toEqual(["Arco", "Pano"]);
    });
  });

  describe("UpdateItemUseCase", () => {
    it("renomeia um item", async () => {
      const created = await itemsRepository.create({ name: "Arco" });
      const sut = new UpdateItemUseCase(itemsRepository);

      const { item } = await sut.execute({
        id: String(created.id),
        name: "Arco de balões",
      });

      expect(item.name).toBe("Arco de balões");
    });

    it("rejeita renomear para nome já existente", async () => {
      await itemsRepository.create({ name: "Pano" });
      const created = await itemsRepository.create({ name: "Arco" });
      const sut = new UpdateItemUseCase(itemsRepository);

      await expect(() =>
        sut.execute({ id: String(created.id), name: "Pano" }),
      ).rejects.toBeInstanceOf(ItemAlreadyExistsError);
    });

    it("rejeita item inexistente", async () => {
      const sut = new UpdateItemUseCase(itemsRepository);
      await expect(() =>
        sut.execute({ id: "nao-existe", name: "X" }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });

  describe("DeleteItemUseCase", () => {
    it("remove item sem uso", async () => {
      const created = await itemsRepository.create({ name: "Arco" });
      const sut = new DeleteItemUseCase(itemsRepository);

      await sut.execute({ id: String(created.id) });
      expect(itemsRepository.items).toHaveLength(0);
    });

    it("bloqueia exclusão de item em uso por um tipo de kit", async () => {
      const arco = await itemsRepository.create({ name: "Arco" });
      await kitTypesRepository.create({
        name: "Kit Básico",
        slug: "kit-basico",
        price: 100,
        items: [{ itemId: String(arco.id), quantity: 1 }],
      });

      const sut = new DeleteItemUseCase(itemsRepository);
      await expect(() =>
        sut.execute({ id: String(arco.id) }),
      ).rejects.toBeInstanceOf(ResourceInUseError);
      expect(itemsRepository.items).toHaveLength(1);
    });

    it("rejeita item inexistente", async () => {
      const sut = new DeleteItemUseCase(itemsRepository);
      await expect(() =>
        sut.execute({ id: "nao-existe" }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });
});
