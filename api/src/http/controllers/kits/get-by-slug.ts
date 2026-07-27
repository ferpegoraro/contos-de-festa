import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetKitBySlugUseCase } from "../../../use-cases/factories/make-kits-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { setPublicCache } from "../../utils/public-cache";

const paramsSchema = z.object({ slug: z.string().min(1) });

export async function getKitBySlug(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { slug } = paramsSchema.parse(request.params);

  try {
    const { kit } = await makeGetKitBySlugUseCase().execute({ slug });
    setPublicCache(reply);
    return reply.status(200).send({ kit });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
