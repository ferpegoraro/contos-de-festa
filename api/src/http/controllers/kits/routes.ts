import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { createKit } from "./create";
import { deleteKit } from "./delete";
import { getKitBySlug } from "./get-by-slug";
import { listKits } from "./list";
import { updateKit } from "./update";

export async function kitsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/kits", listKits);
  app.get("/kits/:slug", getKitBySlug);

  app.register(async (admin) => {
    admin.addHook("onRequest", verifyJwt);
    admin.addHook("onRequest", verifyAdmin);
    admin.post("/kits", createKit);
    admin.put("/kits/:id", updateKit);
    admin.delete("/kits/:id", deleteKit);
  });
}
