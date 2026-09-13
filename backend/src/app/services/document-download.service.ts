import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

export async function downloadDocumentFromCloudinary(
  secureUrl: string,
): Promise<Buffer> {
  try {
    const response = await axios.get<ArrayBuffer>(secureUrl, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw ApiError.serverError("Failed to download document from Cloudinary");
  }
}
