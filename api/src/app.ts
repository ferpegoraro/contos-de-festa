import fastify from "fastify";
import cors from "@fastify/cors";

export const app = fastify();

app.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
});

app.get("/", async () => {
  return { status: "ok" };
});
