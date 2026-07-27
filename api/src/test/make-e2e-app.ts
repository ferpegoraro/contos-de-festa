import { hash } from "bcryptjs";
import { app } from "../app";
import { InMemoryCategoriesRepository } from "../repositories/in-memory/in-memory-categories-repository";
import { InMemoryItemsRepository } from "../repositories/in-memory/in-memory-items-repository";
import { InMemoryKitImagesRepository } from "../repositories/in-memory/in-memory-kit-images-repository";
import { InMemoryKitTypesRepository } from "../repositories/in-memory/in-memory-kit-types-repository";
import { InMemoryKitsRepository } from "../repositories/in-memory/in-memory-kits-repository";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import {
  resetContainer,
  setContainerOverrides,
} from "../use-cases/factories/repositories";
import { FakeCloudinaryProvider } from "./fakes/fake-cloudinary-provider";

export interface E2EContext {
  app: typeof app;
  users: InMemoryUsersRepository;
  categories: InMemoryCategoriesRepository;
  catalogItems: InMemoryItemsRepository;
  kitTypes: InMemoryKitTypesRepository;
  kitImages: InMemoryKitImagesRepository;
  kits: InMemoryKitsRepository;
  cloudinary: FakeCloudinaryProvider;
  /** Cria um admin já com senha hasheada e retorna ele. */
  seedAdmin(input?: {
    email?: string;
    password?: string;
    name?: string;
  }): Promise<{ id: string; email: string; password: string }>;
  /** Faz login e retorna o token + cookie pra próximas requests. */
  loginAs(email: string, password: string): Promise<{ token: string; cookie: string }>;
}

let appReady: Promise<unknown> | null = null;

export async function setupE2E(): Promise<E2EContext> {
  if (!appReady) {
    appReady = Promise.resolve(app.ready());
  }
  await appReady;

  resetContainer();

  const users = new InMemoryUsersRepository();
  const categories = new InMemoryCategoriesRepository();
  const catalogItems = new InMemoryItemsRepository();
  const kitTypes = new InMemoryKitTypesRepository(catalogItems);
  const kitImages = new InMemoryKitImagesRepository();
  const kits = new InMemoryKitsRepository(kitTypes, categories, kitImages);
  const cloudinary = new FakeCloudinaryProvider();

  setContainerOverrides({
    users,
    categories,
    items: catalogItems,
    kitTypes,
    kits,
    kitImages,
    cloudinary,
  });

  const ctx: E2EContext = {
    app,
    users,
    categories,
    catalogItems,
    kitTypes,
    kitImages,
    kits,
    cloudinary,
    async seedAdmin(input = {}) {
      const email = input.email ?? "admin@contos.test";
      const password = input.password ?? "senha-forte-123";
      const name = input.name ?? "Admin";
      const passwordHash = await hash(password, 6);
      const user = await users.create({
        name,
        email,
        passwordHash,
        role: "ADMIN",
      });
      return { id: String(user.id), email, password };
    },
    async loginAs(email, password) {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: { email, password },
      });
      if (response.statusCode !== 200) {
        throw new Error(
          `loginAs failed: ${response.statusCode} ${response.body}`,
        );
      }
      const data = response.json() as { token: string };
      const cookies = response.cookies;
      const cookieHeader = cookies
        .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
        .join("; ");
      return { token: data.token, cookie: cookieHeader };
    },
  };

  return ctx;
}
