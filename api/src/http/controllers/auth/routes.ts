import type { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { logout } from "./logout";
import { profile } from "./profile";
import { register } from "./register";
import { verifyJwt } from "../../middlewares/verify-jwt";

const authRateLimit = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: "1 minute",
    },
  },
};

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/register", authRateLimit, register);
  app.post("/auth/login", authRateLimit, authenticate);
  app.post("/auth/logout", logout);
  app.get("/auth/me", { onRequest: [verifyJwt] }, profile);
}
