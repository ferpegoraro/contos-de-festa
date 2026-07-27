import { prisma } from "../../lib/prisma";
import type { Item } from "../../entities/item";
import type {
  CreateItemInput,
  ItemsRepository,
  UpdateItemInput,
} from "../items-repository";
import { ItemMapper } from "./mappers/item-mapper";

export class PrismaItemsRepository implements ItemsRepository {
  async findById(id: string): Promise<Item | null> {
    const record = await prisma.item.findUnique({ where: { id } });
    return record ? ItemMapper.toEntity(record) : null;
  }

  async findByName(name: string): Promise<Item | null> {
    const record = await prisma.item.findUnique({ where: { name } });
    return record ? ItemMapper.toEntity(record) : null;
  }

  async list(): Promise<Item[]> {
    const records = await prisma.item.findMany({ orderBy: { name: "asc" } });
    return records.map(ItemMapper.toEntity);
  }

  async create(data: CreateItemInput): Promise<Item> {
    const record = await prisma.item.create({ data });
    return ItemMapper.toEntity(record);
  }

  async update(id: string, data: UpdateItemInput): Promise<Item> {
    const record = await prisma.item.update({ where: { id }, data });
    return ItemMapper.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }

  async countUsages(itemId: string): Promise<number> {
    return prisma.kitTypeItem.count({ where: { itemId } });
  }
}
