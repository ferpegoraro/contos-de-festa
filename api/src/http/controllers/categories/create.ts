import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateCategoryUseCase } from "../../../use-cases/factories/make-categories-use-cases";
import { SlugAlreadyExistsError } from "../../../use-cases/errors/slug-already-exists-error";

const bodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().nullish(),
  icon: z.string().nullish(),
});

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { category } = await makeCreateCategoryUseCase().execute(body);
    return reply.status(201).send({ category });
  } catch (error) {
    if (error instanceof SlugAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
