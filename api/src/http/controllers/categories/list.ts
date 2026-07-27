import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListCategoriesUseCase } from "../../../use-cases/factories/make-categories-use-cases";
import { setPublicCache } from "../../utils/public-cache";

export async function listCategories(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { categories } = await makeListCategoriesUseCase().execute();
  setPublicCache(reply);
  return reply.status(200).send({ categories });
}
