/**
 * Testes de integração dos repositórios Prisma contra Postgres real.
 * Schema efêmero criado/derrubado pelo setup (src/test/setup-integration.ts).
 */
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { PrismaCategoriesRepository } from "./prisma-categories-repository";
import { PrismaItemsRepository } from "./prisma-items-repository";
import { PrismaKitImagesRepository } from "./prisma-kit-images-repository";
import { PrismaKitTypesRepository } from "./prisma-kit-types-repository";
import { PrismaKitsRepository } from "./prisma-kits-repository";
import { PrismaUsersRepository } from "./prisma-users-repository";

const usersRepository = new PrismaUsersRepository();
const itemsRepository = new PrismaItemsRepository();
const kitTypesRepository = new PrismaKitTypesRepository();
const categoriesRepository = new PrismaCategoriesRepository();
const kitsRepository = new PrismaKitsRepository();
const kitImagesRepository = new PrismaKitImagesRepository();

beforeEach(async () => {
  // ordem importa por causa das FKs (cascade cobre images/items do tipo)
  await prisma.kit.deleteMany();
  await prisma.category.deleteMany();
  await prisma.kitType.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
});

async function seedKitContext() {
  const arco = await itemsRepository.create({ name: "Arco de balões" });
  const kitType = await kitTypesRepository.create({
    name: "Kit de Mesa",
    slug: "kit-de-mesa",
    price: 150,
    items: [{ itemId: arco.id.toString(), quantity: 1 }],
  });
  const category = await categoriesRepository.create({
    name: "Aniversário",
    slug: "aniversario",
    description: null,
    icon: null,
  });
  return { kitType, category, arco };
}

describe("PrismaItemsRepository", () => {
  it("cria, busca por nome, lista ordenado, atualiza e deleta", async () => {
    await itemsRepository.create({ name: "Pano de mesa" });
    const arco = await itemsRepository.create({ name: "Arco de balões" });

    const byName = await itemsRepository.findByName("Arco de balões");
    expect(byName!.id.toString()).toBe(arco.id.toString());

    const list = await itemsRepository.list();
    expect(list.map((i) => i.name)).toEqual([
      "Arco de balões",
      "Pano de mesa",
    ]);

    const updated = await itemsRepository.update(arco.id.toString(), {
      name: "Arco redondo",
    });
    expect(updated.name).toBe("Arco redondo");

    await itemsRepository.delete(arco.id.toString());
    expect(await itemsRepository.findByName("Arco redondo")).toBeNull();
  });

  it("rejeita nome duplicado (constraint unique)", async () => {
    await itemsRepository.create({ name: "Arco" });
    await expect(itemsRepository.create({ name: "Arco" })).rejects.toThrow();
  });

  it("countUsages conta os tipos de kit que usam o item", async () => {
    const { arco } = await seedKitContext();
    expect(await itemsRepository.countUsages(arco.id.toString())).toBe(1);

    const solto = await itemsRepository.create({ name: "Item solto" });
    expect(await itemsRepository.countUsages(solto.id.toString())).toBe(0);
  });
});

describe("PrismaUsersRepository", () => {
  it("cria e busca usuário por email", async () => {
    const created = await usersRepository.create({
      name: "Admin",
      email: "admin@contos.test",
      passwordHash: "hash",
      role: "ADMIN",
    });

    const found = await usersRepository.findByEmail("admin@contos.test");

    expect(found).not.toBeNull();
    expect(found!.id.toString()).toBe(created.id.toString());
    expect(found!.role).toBe("ADMIN");
  });

  it("retorna null quando email não existe", async () => {
    expect(await usersRepository.findByEmail("nao@existe.com")).toBeNull();
  });
});

describe("PrismaKitTypesRepository", () => {
  it("cria com preço e itens do catálogo, busca por slug, atualiza e deleta", async () => {
    const painel = await itemsRepository.create({ name: "Painel" });
    const toalha = await itemsRepository.create({ name: "Toalha" });

    const created = await kitTypesRepository.create({
      name: "Kit 1",
      slug: "kit-1",
      price: 250.5,
      items: [
        { itemId: painel.id.toString(), quantity: 1 },
        { itemId: toalha.id.toString(), quantity: 2 },
      ],
    });

    const bySlug = await kitTypesRepository.findBySlug("kit-1");
    expect(bySlug!.name).toBe("Kit 1");
    expect(bySlug!.price).toBe(250.5);
    expect(bySlug!.items.map((i) => i.name)).toEqual(["Painel", "Toalha"]);

    const updated = await kitTypesRepository.update(created.id.toString(), {
      name: "Kit Um",
      price: 300,
    });
    expect(updated.name).toBe("Kit Um");
    expect(updated.price).toBe(300);
    // items não informados = lista preservada
    expect(updated.items).toHaveLength(2);

    await kitTypesRepository.delete(created.id.toString());
    expect(await kitTypesRepository.findBySlug("kit-1")).toBeNull();
    // ligações do tipo morrem em cascata; itens do catálogo permanecem
    expect(await prisma.kitTypeItem.count()).toBe(0);
    expect(await prisma.item.count()).toBe(2);
  });

  it("update com items substitui a lista inteira", async () => {
    const antigo = await itemsRepository.create({ name: "Antigo" });
    const novoA = await itemsRepository.create({ name: "Novo A" });
    const novoB = await itemsRepository.create({ name: "Novo B" });

    const created = await kitTypesRepository.create({
      name: "Kit Básico",
      slug: "kit-basico",
      price: 100,
      items: [{ itemId: antigo.id.toString(), quantity: 1 }],
    });

    const updated = await kitTypesRepository.update(created.id.toString(), {
      items: [
        { itemId: novoA.id.toString(), quantity: 2 },
        { itemId: novoB.id.toString(), quantity: null },
      ],
    });

    expect(updated.items.map((i) => i.name)).toEqual(["Novo A", "Novo B"]);
    expect(await prisma.kitTypeItem.count()).toBe(2);
  });

  it("lista ordenado por nome", async () => {
    await kitTypesRepository.create({ name: "Zebra", slug: "zebra", price: 1 });
    await kitTypesRepository.create({ name: "Avião", slug: "aviao", price: 1 });

    const list = await kitTypesRepository.list();

    expect(list.map((t) => t.name)).toEqual(["Avião", "Zebra"]);
  });

  it("rejeita slug duplicado (constraint unique)", async () => {
    await kitTypesRepository.create({ name: "Kit", slug: "kit", price: 1 });

    await expect(
      kitTypesRepository.create({ name: "Outro", slug: "kit", price: 1 }),
    ).rejects.toThrow();
  });
});

describe("PrismaCategoriesRepository", () => {
  it("cria com description/icon e atualiza", async () => {
    const created = await categoriesRepository.create({
      name: "Casamento",
      slug: "casamento",
      description: "Festas de casamento",
      icon: "💍",
    });

    expect(created.description).toBe("Festas de casamento");

    const updated = await categoriesRepository.update(created.id.toString(), {
      description: null,
    });
    expect(updated.description).toBeNull();
  });

  it("busca por slug e deleta", async () => {
    const created = await categoriesRepository.create({
      name: "Boteco",
      slug: "boteco",
      description: null,
      icon: null,
    });

    expect(await categoriesRepository.findBySlug("boteco")).not.toBeNull();

    await categoriesRepository.delete(created.id.toString());
    expect(await categoriesRepository.findBySlug("boteco")).toBeNull();
  });
});

describe("PrismaKitsRepository", () => {
  it("kit sem override herda preço e itens do tipo", async () => {
    const { kitType, category } = await seedKitContext();

    await kitsRepository.create({
      name: "Kit Princesa",
      slug: "kit-princesa",
      description: "Decoração completa tema princesa",
      shortDescription: "Tema princesa",
      featured: true,
      kitTypeId: kitType.id.toString(),
      categoryId: category.id.toString(),
    });

    const kit = await kitsRepository.findBySlug("kit-princesa");

    expect(kit).not.toBeNull();
    expect(kit!.priceOverride).toBeNull();
    expect(kit!.price).toBe(150); // herdado do tipo
    expect(kit!.kitType.items.map((i) => i.name)).toEqual(["Arco de balões"]);
    expect(kit!.category.name).toBe("Aniversário");
  });

  it("kit com override usa o preço promocional; limpar volta a herdar", async () => {
    const { kitType, category } = await seedKitContext();

    const created = await kitsRepository.create({
      name: "Kit Promo",
      slug: "kit-promo",
      description: "desc",
      shortDescription: null,
      priceOverride: 99.9,
      kitTypeId: kitType.id.toString(),
      categoryId: category.id.toString(),
    });

    expect(created.price).toBe(99.9);

    const cleared = await kitsRepository.update(created.id.toString(), {
      priceOverride: null,
    });
    expect(cleared.priceOverride).toBeNull();
    expect(cleared.price).toBe(150);
  });

  it("lista com filtros: categoria, busca insensitive e featured primeiro", async () => {
    const { kitType, category } = await seedKitContext();
    const outraCategoria = await categoriesRepository.create({
      name: "Chá de bebê",
      slug: "cha-de-bebe",
      description: null,
      icon: null,
    });

    const base = {
      description: "desc",
      shortDescription: null,
      kitTypeId: kitType.id.toString(),
    };
    await kitsRepository.create({
      ...base,
      name: "Kit Safari",
      slug: "kit-safari",
      featured: false,
      categoryId: category.id.toString(),
    });
    await kitsRepository.create({
      ...base,
      name: "Kit Princesa",
      slug: "kit-princesa",
      featured: true,
      categoryId: category.id.toString(),
    });
    await kitsRepository.create({
      ...base,
      name: "Kit Nuvem",
      slug: "kit-nuvem",
      featured: false,
      categoryId: outraCategoria.id.toString(),
    });

    const porCategoria = await kitsRepository.list({
      categorySlug: "aniversario",
    });
    expect(porCategoria.total).toBe(2);
    // featured vem primeiro
    expect(porCategoria.kits[0].name).toBe("Kit Princesa");

    const porBusca = await kitsRepository.list({ search: "SAFARI" });
    expect(porBusca.total).toBe(1);
    expect(porBusca.kits[0].slug).toBe("kit-safari");

    const featured = await kitsRepository.list({ featured: true });
    expect(featured.total).toBe(1);

    const paginado = await kitsRepository.list({ page: 2, pageSize: 2 });
    expect(paginado.kits).toHaveLength(1);
    expect(paginado.total).toBe(3);
  });

  it("delete remove imagens em cascata", async () => {
    const { kitType, category } = await seedKitContext();
    const kit = await kitsRepository.create({
      name: "Kit Cascata",
      slug: "kit-cascata",
      description: "desc",
      shortDescription: null,
      kitTypeId: kitType.id.toString(),
      categoryId: category.id.toString(),
    });
    await kitImagesRepository.create({
      kitId: kit.id.toString(),
      url: "https://example.com/foto.jpg",
      publicId: "foto",
      alt: null,
      order: 0,
      isPrimary: true,
    });

    await kitsRepository.delete(kit.id.toString());

    expect(await prisma.kitImage.count()).toBe(0);
    // itens do tipo permanecem (pertencem ao tipo, não ao kit)
    expect(await prisma.kitTypeItem.count()).toBe(1);
  });
});

describe("PrismaKitImagesRepository", () => {
  it("lista ordenado por isPrimary e order; reorder troca a primária", async () => {
    const { kitType, category } = await seedKitContext();
    const kit = await kitsRepository.create({
      name: "Kit Fotos",
      slug: "kit-fotos",
      description: "desc",
      shortDescription: null,
      kitTypeId: kitType.id.toString(),
      categoryId: category.id.toString(),
    });
    const kitId = kit.id.toString();

    const a = await kitImagesRepository.create({
      kitId,
      url: "https://example.com/a.jpg",
      publicId: "a",
      alt: null,
      order: 0,
      isPrimary: true,
    });
    const b = await kitImagesRepository.create({
      kitId,
      url: "https://example.com/b.jpg",
      publicId: "b",
      alt: null,
      order: 1,
      isPrimary: false,
    });

    const listed = await kitImagesRepository.listByKitId(kitId);
    expect(listed[0].publicId).toBe("a");

    const reordered = await kitImagesRepository.reorder(kitId, [
      { id: b.id.toString(), order: 0, isPrimary: true },
      { id: a.id.toString(), order: 1, isPrimary: false },
    ]);

    expect(reordered[0].publicId).toBe("b");
    expect(reordered[0].isPrimary).toBe(true);
    expect(reordered.filter((img) => img.isPrimary)).toHaveLength(1);

    expect(await kitImagesRepository.countByKitId(kitId)).toBe(2);
  });
});
