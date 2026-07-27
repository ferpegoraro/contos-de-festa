import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUploadKitImageUseCase } from "../../../use-cases/factories/make-images-use-cases";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

const paramsSchema = z.object({ id: z.string().uuid() });
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadKitImage(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = paramsSchema.parse(request.params);

  const file = await request.file();
  if (!file) {
    return reply.status(400).send({ message: "Arquivo não enviado." });
  }

  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return reply
      .status(415)
      .send({ message: "Formato inválido. Use JPG, PNG, WebP ou AVIF." });
  }

  const buffer = await file.toBuffer();
  if (buffer.byteLength > MAX_SIZE_BYTES) {
    return reply
      .status(413)
      .send({ message: "Imagem maior que 5MB. Reduza e tente novamente." });
  }

  const altField = file.fields.alt as { value?: string } | undefined;
  const isPrimaryField = file.fields.isPrimary as
    | { value?: string }
    | undefined;

  try {
    const { image } = await makeUploadKitImageUseCase().execute({
      kitId: id,
      fileBuffer: buffer,
      filename: file.filename,
      mimetype: file.mimetype,
      alt: altField?.value ?? null,
      isPrimary: isPrimaryField?.value === "true" ? true : undefined,
    });
    return reply.status(201).send({ image });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
