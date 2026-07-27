import { InMemoryCategoriesRepository } from "../../repositories/in-memory/in-memory-categories-repository";
import { InMemoryItemsRepository } from "../../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitImagesRepository } from "../../repositories/in-memory/in-memory-kit-images-repository";
import { InMemoryKitTypesRepository } from "../../repositories/in-memory/in-memory-kit-types-repository";
import { InMemoryKitsRepository } from "../../repositories/in-memory/in-memory-kits-repository";

export interface KitContext {
  itemsRepository: InMemoryItemsRepository;
  kitTypesRepository: InMemoryKitTypesRepository;
  categoriesRepository: InMemoryCategoriesRepository;
  kitImagesRepository: InMemoryKitImagesRepository;
  kitsRepository: InMemoryKitsRepository;
}

export function makeKitContext(): KitContext {
  const itemsRepository = new InMemoryItemsRepository();
  const kitTypesRepository = new InMemoryKitTypesRepository(itemsRepository);
  const categoriesRepository = new InMemoryCategoriesRepository();
  const kitImagesRepository = new InMemoryKitImagesRepository();
  const kitsRepository = new InMemoryKitsRepository(
    kitTypesRepository,
    categoriesRepository,
    kitImagesRepository,
  );

  return {
    itemsRepository,
    kitTypesRepository,
    categoriesRepository,
    kitImagesRepository,
    kitsRepository,
  };
}

export async function seedKitTypeAndCategory(ctx: KitContext) {
  const arco = await ctx.itemsRepository.create({ name: "Arco de balões" });
  const kitType = await ctx.kitTypesRepository.create({
    name: "Kit de Mesa",
    slug: "kit-de-mesa",
    price: 150,
    items: [{ itemId: String(arco.id), quantity: 1 }],
  });
  const category = await ctx.categoriesRepository.create({
    name: "Aniversário",
    slug: "aniversario",
  });
  return { kitType, category, arco };
}
