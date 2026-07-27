import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

describe("AuthenticateUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("autentica quando email e senha estão corretos", async () => {
    await usersRepository.create({
      name: "Cida",
      email: "cida@contosdefestas.com",
      passwordHash: await hash("senha-forte-123", 6),
      role: "ADMIN",
    });

    const { user } = await sut.execute({
      email: "cida@contosdefestas.com",
      password: "senha-forte-123",
    });

    expect(user.email).toBe("cida@contosdefestas.com");
    expect(user.role).toBe("ADMIN");
  });

  it("rejeita quando o usuário não existe", async () => {
    await expect(() =>
      sut.execute({
        email: "ninguem@example.com",
        password: "qualquer",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rejeita quando a senha está errada", async () => {
    await usersRepository.create({
      name: "Cida",
      email: "cida@contosdefestas.com",
      passwordHash: await hash("senha-forte-123", 6),
      role: "ADMIN",
    });

    await expect(() =>
      sut.execute({
        email: "cida@contosdefestas.com",
        password: "senha-errada",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
