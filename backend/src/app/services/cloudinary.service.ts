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
    const isPdf = input.originalFileName.toLowerCase().endsWith(".pdf");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // PDFs MUST be "image" for native in-browser preview without downloading;
        // DOCX and TXT remain "raw"
        resource_type: isPdf ? "image" : "raw",
        folder: "documind/documents",
        use_filename: false,
        unique_filename: true,
        ...(isPdf ? { format: "pdf" } : {}),
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
  // Try deleting as "raw" first (for DOCX/TXT/legacy files)
  let result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });

  // If not found as "raw", try deleting as "image" (for PDFs)
  if (result.result === "not_found") {
    result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  }

  if (result.result !== "ok" && result.result !== "not_found") {
    throw ApiError.notFound(`Document not deleted: ${result.result}`);
  }
  return result;
}
