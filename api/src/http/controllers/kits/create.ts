import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateKitUseCase } from "../../../use-cases/factories/make-kits-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../../../use-cases/errors/slug-already-exists-error";

const bodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional().default(""),
  shortDescription: z.string().nullish(),
  /** Preço promocional — ausente/null herda o preço do tipo. */
  priceOverride: z.number().nonnegative().nullish(),
  featured: z.boolean().optional(),
  kitTypeId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

export async function createKit(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { kit } = await makeCreateKitUseCase().execute(body);
    return reply.status(201).send({ kit });
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
