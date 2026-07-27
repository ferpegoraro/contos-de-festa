import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeleteKitUseCase } from "../../../use-cases/factories/make-kits-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function deleteKit(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);

  try {
    await makeDeleteKitUseCase().execute({ id });
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
