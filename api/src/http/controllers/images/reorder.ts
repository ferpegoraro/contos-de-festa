import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeReorderKitImagesUseCase } from "../../../use-cases/factories/make-images-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        order: z.number().int().nonnegative(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .min(1),
});

export async function reorderKitImages(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);
  const { items } = bodySchema.parse(request.body);

  try {
    const { images } = await makeReorderKitImagesUseCase().execute({
      kitId: id,
      items,
    });
    return reply.status(200).send({ images });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
