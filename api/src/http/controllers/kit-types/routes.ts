import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { createKitType } from "./create";
import { deleteKitType } from "./delete";
import { listKitTypes } from "./list";
import { updateKitType } from "./update";

export async function kitTypesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/kit-types", listKitTypes);

  app.register(async (admin) => {
    admin.addHook("onRequest", verifyJwt);
    admin.addHook("onRequest", verifyAdmin);
    admin.post("/kit-types", createKitType);
    admin.put("/kit-types/:id", updateKitType);
    admin.delete("/kit-types/:id", deleteKitType);
  });
}
