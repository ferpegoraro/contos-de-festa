import { randomUUID } from "node:crypto";
import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { env } from "./env";
import { authRoutes } from "./http/controllers/auth/routes";
import { itemsRoutes } from "./http/controllers/items/routes";
import { kitTypesRoutes } from "./http/controllers/kit-types/routes";
import { categoriesRoutes } from "./http/controllers/categories/routes";
import { kitsRoutes } from "./http/controllers/kits/routes";
import { kitImagesRoutes } from "./http/controllers/images/routes";

export const app = fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    redact: ["req.headers.authorization", "req.headers.cookie"],
  },
  genReqId: () => randomUUID(),
  disableRequestLogging: env.NODE_ENV === "test",
});

app.register(helmet, {
  contentSecurityPolicy: env.NODE_ENV === "production",
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

app.register(rateLimit, {
  global: false,
});

app.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(cookie);

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "contos_token",
    signed: false,
  },
});

app.register(multipart, {
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

app.get("/", async () => ({ status: "ok" }));

app.register(authRoutes);
app.register(itemsRoutes);
app.register(kitTypesRoutes);
app.register(categoriesRoutes);
app.register(kitsRoutes);
app.register(kitImagesRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Erro de validação.", issues: error.format() });
  }

  request.log.error({ err: error }, "unhandled error");

  return reply.status(500).send({ message: "Erro interno do servidor." });
});
