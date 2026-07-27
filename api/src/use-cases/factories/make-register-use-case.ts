import { env } from "../../env";
import { RegisterUseCase } from "../auth/register";
import { getUsersRepo } from "./repositories";

export function makeRegisterUseCase() {
  return new RegisterUseCase(getUsersRepo(), env.ADMIN_REGISTRATION_KEY);
}
