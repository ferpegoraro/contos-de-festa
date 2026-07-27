import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateKitTypeUseCase } from "../../../use-cases/factories/make-kit-types-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../../../use-cases/errors/slug-already-exists-error";

const bodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  price: z.number().nonnegative(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.number().int().positive().nullish(),
      }),
    )
    .optional(),
});

export async function createKitType(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { kitType } = await makeCreateKitTypeUseCase().execute(body);
    return reply.status(201).send({ kitType });
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
