import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloudinary.config.js";
import { ApiError } from "../utils/ApiError.js";

interface UploadDocumentInput {
  buffer: Buffer;
  originalFileName: string;
}
export function uploadDocumentToCloudinary(
  input: UploadDocumentInput,
): Promise<UploadApiResponse> {
  return new Promise((res, rej) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "documind/documents",
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return rej(error);
        }
        if (!result) {
          return rej(ApiError.serverError("Cloudinary upload failed"));
        }
        res(result);
      },
    );
    uploadStream.end(input.buffer);
  });
}

export async function deleteDocumentFromCloudinary(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });

  if (result.result !== "ok" && result.result !== "not_found") {
    throw ApiError.notFound(`Document not deleted: ${result.result}`);
  }
  return result;
}
