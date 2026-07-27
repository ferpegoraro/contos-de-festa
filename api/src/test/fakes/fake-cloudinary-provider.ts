import { randomUUID } from "node:crypto";
import type {
  CloudinaryProvider,
  UploadInput,
  UploadResult,
} from "../../lib/cloudinary";

export interface RecordedUpload extends UploadInput {
  publicId: string;
  url: string;
}

export class FakeCloudinaryProvider implements CloudinaryProvider {
  public uploads: RecordedUpload[] = [];
  public deletions: string[] = [];
  public deleteShouldFail = false;

  async uploadImage(input: UploadInput): Promise<UploadResult> {
    const publicId = `${input.folder}/${randomUUID()}`;
    const url = `https://fake-cloudinary.test/${publicId}.png`;

    this.uploads.push({ ...input, publicId, url });
    return { url, publicId };
  }

  async deleteImage(publicId: string): Promise<void> {
    if (this.deleteShouldFail) {
      throw new Error(`Falha ao deletar ${publicId}`);
    }
    this.deletions.push(publicId);
  }
}
