import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateItemUseCase } from "../../../use-cases/factories/make-items-use-cases";
import { ItemAlreadyExistsError } from "../../../use-cases/errors/item-already-exists-error";

const bodySchema = z.object({
  name: z.string().min(2),
});

export async function createItem(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { item } = await makeCreateItemUseCase().execute(body);
    return reply.status(201).send({ item });
  } catch (error) {
    if (error instanceof ItemAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
