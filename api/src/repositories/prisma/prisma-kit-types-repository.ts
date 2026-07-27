import { prisma } from "../../lib/prisma";
import type { KitType } from "../../entities/kit-type";
import type {
  CreateKitTypeInput,
  KitTypesRepository,
  UpdateKitTypeInput,
} from "../kit-types-repository";
import { KitTypeMapper, kitTypeInclude } from "./mappers/kit-type-mapper";

export class PrismaKitTypesRepository implements KitTypesRepository {
  async findById(id: string): Promise<KitType | null> {
    const record = await prisma.kitType.findUnique({
      where: { id },
      include: kitTypeInclude,
    });
    return record ? KitTypeMapper.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<KitType | null> {
    const record = await prisma.kitType.findUnique({
      where: { slug },
      include: kitTypeInclude,
    });
    return record ? KitTypeMapper.toEntity(record) : null;
  }

  async list(): Promise<KitType[]> {
    const records = await prisma.kitType.findMany({
      orderBy: { name: "asc" },
      include: kitTypeInclude,
    });
    return records.map(KitTypeMapper.toEntity);
  }

  async create(data: CreateKitTypeInput): Promise<KitType> {
    const record = await prisma.kitType.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        items: data.items?.length
          ? {
              create: data.items.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity ?? null,
              })),
            }
          : undefined,
      },
      include: kitTypeInclude,
    });
    return KitTypeMapper.toEntity(record);
  }

  async update(id: string, data: UpdateKitTypeInput): Promise<KitType> {
    const record = await prisma.$transaction(async (tx) => {
      // items presente = substitui a lista inteira
      if (data.items) {
        await tx.kitTypeItem.deleteMany({ where: { kitTypeId: id } });
        if (data.items.length > 0) {
          await tx.kitTypeItem.createMany({
            data: data.items.map((item) => ({
              kitTypeId: id,
              itemId: item.itemId,
              quantity: item.quantity ?? null,
            })),
          });
        }
      }

      return tx.kitType.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          price: data.price,
        },
        include: kitTypeInclude,
      });
    });
    return KitTypeMapper.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.kitType.delete({ where: { id } });
  }
}
