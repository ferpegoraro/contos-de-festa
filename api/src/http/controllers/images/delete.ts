import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeleteKitImageUseCase } from "../../../use-cases/factories/make-images-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({
  id: z.string().uuid(),
  imageId: z.string().uuid(),
});

export async function deleteKitImage(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id, imageId } = paramsSchema.parse(request.params);

  try {
    await makeDeleteKitImageUseCase().execute({ kitId: id, imageId });
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
