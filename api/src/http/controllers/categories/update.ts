import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateCategoryUseCase } from "../../../use-cases/factories/make-categories-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { SlugAlreadyExistsError } from "../../../use-cases/errors/slug-already-exists-error";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().nullish(),
  icon: z.string().nullish(),
});

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  try {
    const { category } = await makeUpdateCategoryUseCase().execute({
      id,
      ...body,
    });
    return reply.status(200).send({ category });
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
