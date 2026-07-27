import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterUseCase } from "../../../use-cases/factories/make-register-use-case";
import { EmailAlreadyExistsError } from "../../../use-cases/errors/email-already-exists-error";
import { InvalidAdminKeyError } from "../../../use-cases/errors/invalid-admin-key-error";
import { WeakPasswordError } from "../../../use-cases/errors/weak-password-error";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(10, "A senha deve ter ao menos 10 caracteres.")
    .regex(/[0-9]/, "A senha deve conter ao menos um número."),
  adminKey: z.string().min(1),
});

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { user } = await makeRegisterUseCase().execute(body);
    return reply.status(201).send({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof InvalidAdminKeyError) {
      return reply.status(403).send({ message: error.message });
    }
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    if (error instanceof WeakPasswordError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
