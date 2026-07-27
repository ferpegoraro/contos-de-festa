import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateItemUseCase } from "../../../use-cases/factories/make-items-use-cases";
import { ItemAlreadyExistsError } from "../../../use-cases/errors/item-already-exists-error";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({
  name: z.string().min(2).optional(),
});

export async function updateItem(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  try {
    const { item } = await makeUpdateItemUseCase().execute({ id, ...body });
    return reply.status(200).send({ item });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof ItemAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
