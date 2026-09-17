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

export interface DeleteDocumentInput {
  publicId: string;
  mimeType?: string;
  originalFileName?: string;
}

export async function deleteDocumentFromCloudinary(
  input: string | DeleteDocumentInput,
) {
  const publicId = typeof input === "string" ? input : input?.publicId;
  if (!publicId) return { result: "ok" };

  const isPdf =
    typeof input === "object" &&
    (input.mimeType === "application/pdf" ||
      Boolean(input.originalFileName?.toLowerCase().endsWith(".pdf")));

  // Select primary resource type based on file type
  const primaryType: "image" | "raw" = isPdf ? "image" : "raw";
  const fallbackType: "image" | "raw" = isPdf ? "raw" : "image";

  const isNotFound = (res?: string) =>
    !res || res === "not found" || res === "not_found";

  try {
    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: primaryType,
    });

    // Cloudinary returns "not found" (with a space) when resource_type does not match
    if (isNotFound(result?.result)) {
      result = await cloudinary.uploader.destroy(publicId, {
        resource_type: fallbackType,
      });
    }

    return result;
  } catch (error: any) {
    console.warn(
      `⚠️ Cloudinary destroy failed for publicId "${publicId}":`,
      error?.message || error,
    );
    // Non-blocking: allow database and Pinecone deletion to proceed
    return { result: "ok" };
  }
}
