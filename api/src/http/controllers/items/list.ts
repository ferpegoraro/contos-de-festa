import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListItemsUseCase } from "../../../use-cases/factories/make-items-use-cases";

export async function listItems(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { items } = await makeListItemsUseCase().execute();
  return reply.status(200).send({ items });
}
