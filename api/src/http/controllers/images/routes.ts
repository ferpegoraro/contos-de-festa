import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { deleteKitImage } from "./delete";
import { reorderKitImages } from "./reorder";
import { uploadKitImage } from "./upload";

export async function kitImagesRoutes(app: FastifyInstance): Promise<void> {
  app.register(async (admin) => {
    admin.addHook("onRequest", verifyJwt);
    admin.addHook("onRequest", verifyAdmin);
    admin.post("/kits/:id/images", uploadKitImage);
    admin.put("/kits/:id/images/reorder", reorderKitImages);
    admin.delete("/kits/:id/images/:imageId", deleteKitImage);
  });
}
