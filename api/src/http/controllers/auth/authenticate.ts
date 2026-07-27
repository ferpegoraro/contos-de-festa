import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { env } from "../../../env";
import { makeAuthenticateUseCase } from "../../../use-cases/factories/make-authenticate-use-case";
import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credentials-error";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const body = bodySchema.parse(request.body);

  try {
    const { user } = await makeAuthenticateUseCase().execute(body);

    const token = await reply.jwtSign(
      { sub: user.id.toString(), role: user.role },
      { sign: { expiresIn: "7d" } },
    );

    reply.setCookie("contos_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS_IN_SECONDS,
    });

    return reply.status(200).send({
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }
    throw error;
  }
}
