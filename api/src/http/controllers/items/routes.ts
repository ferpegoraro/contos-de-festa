import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { createItem } from "./create";
import { deleteItem } from "./delete";
import { listItems } from "./list";
import { updateItem } from "./update";

export async function itemsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/items", listItems);

  app.register(async (admin) => {
    admin.addHook("onRequest", verifyJwt);
    admin.addHook("onRequest", verifyAdmin);
    admin.post("/items", createItem);
    admin.put("/items/:id", updateItem);
    admin.delete("/items/:id", deleteItem);
  });
}
