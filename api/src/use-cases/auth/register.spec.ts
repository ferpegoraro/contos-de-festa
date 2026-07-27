import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { EmailAlreadyExistsError } from "../errors/email-already-exists-error";
import { InvalidAdminKeyError } from "../errors/invalid-admin-key-error";
import { WeakPasswordError } from "../errors/weak-password-error";
import { RegisterUseCase } from "./register";

const ADMIN_KEY = "secret-admin-key";

describe("RegisterUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository, ADMIN_KEY);
  });

  it("cria um admin quando a chave de registro é válida", async () => {
    const { user } = await sut.execute({
      name: "Cida",
      email: "cida@contosdefestas.com",
      password: "senha-forte-123",
      adminKey: ADMIN_KEY,
    });

    expect(user.role).toBe("ADMIN");
    expect(user.email).toBe("cida@contosdefestas.com");
    expect(usersRepository.items).toHaveLength(1);
  });

  it("armazena o hash da senha (não a senha em texto puro)", async () => {
    const { user } = await sut.execute({
      name: "Cida",
      email: "cida@contosdefestas.com",
      password: "senha-forte-123",
      adminKey: ADMIN_KEY,
    });

    expect(user.passwordHash).not.toBe("senha-forte-123");
    await expect(compare("senha-forte-123", user.passwordHash)).resolves.toBe(true);
  });

  it("rejeita quando a chave de admin é inválida", async () => {
    await expect(() =>
      sut.execute({
        name: "Intruso",
        email: "intruso@example.com",
        password: "qualquer-coisa",
        adminKey: "chave-errada",
      }),
    ).rejects.toBeInstanceOf(InvalidAdminKeyError);

    expect(usersRepository.items).toHaveLength(0);
  });

  it("rejeita senha com menos de 10 caracteres", async () => {
    await expect(() =>
      sut.execute({
        name: "Cida",
        email: "cida@contosdefestas.com",
        password: "abc1",
        adminKey: ADMIN_KEY,
      }),
    ).rejects.toBeInstanceOf(WeakPasswordError);
  });

  it("rejeita senha sem número", async () => {
    await expect(() =>
      sut.execute({
        name: "Cida",
        email: "cida@contosdefestas.com",
        password: "senha-forte-sem-numero",
        adminKey: ADMIN_KEY,
      }),
    ).rejects.toBeInstanceOf(WeakPasswordError);
  });

  it("rejeita quando o e-mail já está cadastrado", async () => {
    await sut.execute({
      name: "Cida",
      email: "cida@contosdefestas.com",
      password: "senha-forte-123",
      adminKey: ADMIN_KEY,
    });

    await expect(() =>
      sut.execute({
        name: "Outra",
        email: "cida@contosdefestas.com",
        password: "outra-senha-123",
        adminKey: ADMIN_KEY,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);

    expect(usersRepository.items).toHaveLength(1);
  });
});
