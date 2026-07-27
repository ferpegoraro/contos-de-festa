import { getItemsRepo } from "./repositories";
import { CreateItemUseCase } from "../items/create-item";
import { DeleteItemUseCase } from "../items/delete-item";
import { ListItemsUseCase } from "../items/list-items";
import { UpdateItemUseCase } from "../items/update-item";

export const makeCreateItemUseCase = () => new CreateItemUseCase(getItemsRepo());
export const makeListItemsUseCase = () => new ListItemsUseCase(getItemsRepo());
export const makeUpdateItemUseCase = () => new UpdateItemUseCase(getItemsRepo());
export const makeDeleteItemUseCase = () => new DeleteItemUseCase(getItemsRepo());
