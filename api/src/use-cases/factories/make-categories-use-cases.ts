import { getCategoriesRepo, getKitsRepo } from "./repositories";
import { CreateCategoryUseCase } from "../categories/create-category";
import { DeleteCategoryUseCase } from "../categories/delete-category";
import { ListCategoriesUseCase } from "../categories/list-categories";
import { UpdateCategoryUseCase } from "../categories/update-category";

export const makeCreateCategoryUseCase = () =>
  new CreateCategoryUseCase(getCategoriesRepo());
export const makeListCategoriesUseCase = () =>
  new ListCategoriesUseCase(getCategoriesRepo());
export const makeUpdateCategoryUseCase = () =>
  new UpdateCategoryUseCase(getCategoriesRepo());
export const makeDeleteCategoryUseCase = () =>
  new DeleteCategoryUseCase(getCategoriesRepo(), getKitsRepo());
