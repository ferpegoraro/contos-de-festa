import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateKitTypeUseCase } from "../../../use-cases/factories/make-kit-types-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../../../use-cases/errors/slug-already-exists-error";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.number().int().positive().nullish(),
      }),
    )
    .optional(),
});

export async function updateKitType(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  try {
    const { kitType } = await makeUpdateKitTypeUseCase().execute({
      id,
      ...body,
    });
    return reply.status(200).send({ kitType });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof SlugAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
