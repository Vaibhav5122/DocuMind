import { ApiError } from "../utils/ApiError.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadDocumentToCloudinary } from "../services/cloudinary.service.js";

export class UploadController {
  public async testUploadController(req: Request, res: Response) {
    if (!req.file) {
      throw ApiError.badRequest("File is required");
    }
    // console.log("Donee", req.user?.id);
    // console.log(mongoose.isValidObjectId(req.user?.id));
    //Cloudinary upload
    const result = await uploadDocumentToCloudinary({
      buffer: req.file.buffer,
      originalFileName: req.file.originalname,
    });

    console.log("Resulttt", result);
    return ApiResponse.ok(res, "File uploaded", {
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
}
