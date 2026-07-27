import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeleteItemUseCase } from "../../../use-cases/factories/make-items-use-cases";
import { ResourceInUseError } from "../../../use-cases/errors/resource-in-use-error";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function deleteItem(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);

  try {
    await makeDeleteItemUseCase().execute({ id });
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof ResourceInUseError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
