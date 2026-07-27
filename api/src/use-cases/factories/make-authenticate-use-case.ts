import { AuthenticateUseCase } from "../auth/authenticate";
import { getUsersRepo } from "./repositories";

export function makeAuthenticateUseCase() {
  return new AuthenticateUseCase(getUsersRepo());
}
