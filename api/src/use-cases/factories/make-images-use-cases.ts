import {
  getCloudinary,
  getKitImagesRepo,
  getKitsRepo,
} from "./repositories";
import { DeleteKitImageUseCase } from "../images/delete-kit-image";
import { ReorderKitImagesUseCase } from "../images/reorder-kit-images";
import { UploadKitImageUseCase } from "../images/upload-kit-image";

export const makeUploadKitImageUseCase = () =>
  new UploadKitImageUseCase(
    getKitsRepo(),
    getKitImagesRepo(),
    getCloudinary(),
  );

export const makeDeleteKitImageUseCase = () =>
  new DeleteKitImageUseCase(getKitImagesRepo(), getCloudinary());

export const makeReorderKitImagesUseCase = () =>
  new ReorderKitImagesUseCase(getKitsRepo(), getKitImagesRepo());
