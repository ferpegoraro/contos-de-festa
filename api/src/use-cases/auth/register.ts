import { hash } from "bcryptjs";
import type { User } from "../../entities/user";
import type { UsersRepository } from "../../repositories/users-repository";
import { EmailAlreadyExistsError } from "../errors/email-already-exists-error";
import { InvalidAdminKeyError } from "../errors/invalid-admin-key-error";
import { WeakPasswordError } from "../errors/weak-password-error";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  adminKey: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

const MIN_PASSWORD_LENGTH = 10;
const PASSWORD_REQUIRES_NUMBER = /[0-9]/;

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private adminRegistrationKey: string,
  ) {}

  async execute({
    name,
    email,
    password,
    adminKey,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    if (adminKey !== this.adminRegistrationKey) {
      throw new InvalidAdminKeyError();
    }

    if (
      password.length < MIN_PASSWORD_LENGTH ||
      !PASSWORD_REQUIRES_NUMBER.test(password)
    ) {
      throw new WeakPasswordError();
    }

    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
      role: "ADMIN",
    });

    return { user };
  }
}
