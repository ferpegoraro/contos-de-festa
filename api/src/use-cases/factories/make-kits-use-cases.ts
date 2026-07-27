import {
  getCategoriesRepo,
  getCloudinary,
  getKitImagesRepo,
  getKitTypesRepo,
  getKitsRepo,
} from "./repositories";
import { CreateKitUseCase } from "../kits/create-kit";
import { DeleteKitUseCase } from "../kits/delete-kit";
import { GetKitBySlugUseCase } from "../kits/get-kit-by-slug";
import { ListKitsUseCase } from "../kits/list-kits";
import { UpdateKitUseCase } from "../kits/update-kit";

export const makeCreateKitUseCase = () =>
  new CreateKitUseCase(getKitsRepo(), getKitTypesRepo(), getCategoriesRepo());

export const makeListKitsUseCase = () => new ListKitsUseCase(getKitsRepo());

export const makeGetKitBySlugUseCase = () =>
  new GetKitBySlugUseCase(getKitsRepo());

export const makeUpdateKitUseCase = () =>
  new UpdateKitUseCase(getKitsRepo(), getKitTypesRepo(), getCategoriesRepo());

export const makeDeleteKitUseCase = () =>
  new DeleteKitUseCase(getKitsRepo(), getKitImagesRepo(), getCloudinary());
