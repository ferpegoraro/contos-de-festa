import { v2 as cloudinary } from "cloudinary";
import { env } from "../env";

export interface UploadInput {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  folder: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface CloudinaryProvider {
  uploadImage(input: UploadInput): Promise<UploadResult>;
  deleteImage(publicId: string): Promise<void>;
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export class CloudinaryService implements CloudinaryProvider {
  async uploadImage({ buffer, folder }: UploadInput): Promise<UploadResult> {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (error, uploaded) => {
            if (error || !uploaded) {
              return reject(error ?? new Error("Falha no upload"));
            }
            resolve({
              secure_url: uploaded.secure_url,
              public_id: uploaded.public_id,
            });
          },
        );
        stream.end(buffer);
      },
    );

    return { url: result.secure_url, publicId: result.public_id };
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
