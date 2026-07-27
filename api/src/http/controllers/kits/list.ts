import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeListKitsUseCase } from "../../../use-cases/factories/make-kits-use-cases";
import { setPublicCache } from "../../utils/public-cache";

const querySchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  featured: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : value === "true",
    ),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export async function listKits(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const query = querySchema.parse(request.query);

  const result = await makeListKitsUseCase().execute({
    kitTypeSlug: query.type,
    categorySlug: query.category,
    search: query.search,
    featured: query.featured,
    page: query.page,
    pageSize: query.pageSize,
  });

  setPublicCache(reply);
  return reply.status(200).send(result);
}
