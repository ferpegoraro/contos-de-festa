import { CloudinaryService, type CloudinaryProvider } from "../../lib/cloudinary";
import type { CategoriesRepository } from "../../repositories/categories-repository";
import type { ItemsRepository } from "../../repositories/items-repository";
import type { KitImagesRepository } from "../../repositories/kit-images-repository";
import type { KitTypesRepository } from "../../repositories/kit-types-repository";
import type { KitsRepository } from "../../repositories/kits-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import { PrismaCategoriesRepository } from "../../repositories/prisma/prisma-categories-repository";
import { PrismaItemsRepository } from "../../repositories/prisma/prisma-items-repository";
import { PrismaKitImagesRepository } from "../../repositories/prisma/prisma-kit-images-repository";
import { PrismaKitTypesRepository } from "../../repositories/prisma/prisma-kit-types-repository";
import { PrismaKitsRepository } from "../../repositories/prisma/prisma-kits-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";

interface Container {
  users?: UsersRepository;
  categories?: CategoriesRepository;
  items?: ItemsRepository;
  kitTypes?: KitTypesRepository;
  kits?: KitsRepository;
  kitImages?: KitImagesRepository;
  cloudinary?: CloudinaryProvider;
}

const container: Container = {};

export const getUsersRepo = (): UsersRepository =>
  container.users ?? (container.users = new PrismaUsersRepository());

export const getCategoriesRepo = (): CategoriesRepository =>
  container.categories ??
  (container.categories = new PrismaCategoriesRepository());

export const getItemsRepo = (): ItemsRepository =>
  container.items ?? (container.items = new PrismaItemsRepository());

export const getKitTypesRepo = (): KitTypesRepository =>
  container.kitTypes ?? (container.kitTypes = new PrismaKitTypesRepository());

export const getKitsRepo = (): KitsRepository =>
  container.kits ?? (container.kits = new PrismaKitsRepository());

export const getKitImagesRepo = (): KitImagesRepository =>
  container.kitImages ?? (container.kitImages = new PrismaKitImagesRepository());

export const getCloudinary = (): CloudinaryProvider =>
  container.cloudinary ?? (container.cloudinary = new CloudinaryService());

export function setContainerOverrides(overrides: Container): void {
  Object.assign(container, overrides);
}

export function resetContainer(): void {
  for (const key of Object.keys(container) as (keyof Container)[]) {
    delete container[key];
  }
}
