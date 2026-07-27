import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsersRepo } from "../../../use-cases/factories/repositories";

export async function profile(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await getUsersRepo().findById(request.user.sub);

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  return reply.status(200).send({
    user: {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
