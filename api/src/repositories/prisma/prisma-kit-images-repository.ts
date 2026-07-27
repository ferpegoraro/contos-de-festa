import { prisma } from "../../lib/prisma";
import type { KitImage } from "../../entities/kit-image";
import type {
  CreateKitImageInput,
  KitImagesRepository,
  ReorderInput,
} from "../kit-images-repository";
import { KitImageMapper } from "./mappers/kit-image-mapper";

export class PrismaKitImagesRepository implements KitImagesRepository {
  async findById(id: string): Promise<KitImage | null> {
    const record = await prisma.kitImage.findUnique({ where: { id } });
    return record ? KitImageMapper.toEntity(record) : null;
  }

  async listByKitId(kitId: string): Promise<KitImage[]> {
    const records = await prisma.kitImage.findMany({
      where: { kitId },
      orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
    });
    return records.map(KitImageMapper.toEntity);
  }

  async create(data: CreateKitImageInput): Promise<KitImage> {
    const record = await prisma.kitImage.create({
      data: {
        kitId: data.kitId,
        url: data.url,
        publicId: data.publicId,
        alt: data.alt ?? null,
        order: data.order ?? 0,
        isPrimary: data.isPrimary ?? false,
      },
    });
    return KitImageMapper.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.kitImage.delete({ where: { id } });
  }

  async reorder(
    kitId: string,
    items: ReorderInput[],
  ): Promise<KitImage[]> {
    await prisma.$transaction([
      prisma.kitImage.updateMany({
        where: { kitId },
        data: { isPrimary: false },
      }),
      ...items.map((item) =>
        prisma.kitImage.update({
          where: { id: item.id },
          data: {
            order: item.order,
            isPrimary: item.isPrimary ?? false,
          },
        }),
      ),
    ]);

    return this.listByKitId(kitId);
  }

  async countByKitId(kitId: string): Promise<number> {
    return prisma.kitImage.count({ where: { kitId } });
  }

  async unsetPrimary(kitId: string): Promise<void> {
    await prisma.kitImage.updateMany({
      where: { kitId },
      data: { isPrimary: false },
    });
  }
}
