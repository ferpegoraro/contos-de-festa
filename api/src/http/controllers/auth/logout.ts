import type { FastifyReply, FastifyRequest } from "fastify";

export async function logout(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  reply.clearCookie("contos_token", { path: "/" });
  return reply.status(204).send();
}
