import { getItemsRepo, getKitTypesRepo, getKitsRepo } from "./repositories";
import { CreateKitTypeUseCase } from "../kit-types/create-kit-type";
import { DeleteKitTypeUseCase } from "../kit-types/delete-kit-type";
import { ListKitTypesUseCase } from "../kit-types/list-kit-types";
import { UpdateKitTypeUseCase } from "../kit-types/update-kit-type";

export const makeCreateKitTypeUseCase = () =>
  new CreateKitTypeUseCase(getKitTypesRepo(), getItemsRepo());
export const makeListKitTypesUseCase = () =>
  new ListKitTypesUseCase(getKitTypesRepo());
export const makeUpdateKitTypeUseCase = () =>
  new UpdateKitTypeUseCase(getKitTypesRepo(), getItemsRepo());
export const makeDeleteKitTypeUseCase = () =>
  new DeleteKitTypeUseCase(getKitTypesRepo(), getKitsRepo());
