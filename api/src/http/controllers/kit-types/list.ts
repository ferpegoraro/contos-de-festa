import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListKitTypesUseCase } from "../../../use-cases/factories/make-kit-types-use-cases";
import { setPublicCache } from "../../utils/public-cache";

export async function listKitTypes(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { kitTypes } = await makeListKitTypesUseCase().execute();
  setPublicCache(reply);
  return reply.status(200).send({ kitTypes });
}
