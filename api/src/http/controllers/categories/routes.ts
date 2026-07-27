import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { createCategory } from "./create";
import { deleteCategory } from "./delete";
import { listCategories } from "./list";
import { updateCategory } from "./update";

export async function categoriesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/categories", listCategories);

  app.register(async (admin) => {
    admin.addHook("onRequest", verifyJwt);
    admin.addHook("onRequest", verifyAdmin);
    admin.post("/categories", createCategory);
    admin.put("/categories/:id", updateCategory);
    admin.delete("/categories/:id", deleteCategory);
  });
}
