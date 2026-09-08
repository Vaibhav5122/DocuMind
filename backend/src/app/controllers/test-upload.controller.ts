import { ApiError } from "../utils/ApiError.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadDocumentToCloudinary } from "../services/cloudinary.service.js";
import { upload } from "../middlewares/upload.middleware.js";

export class UploadController {
  public testUploadController(req: Request, res: Response) {
    if (!req.file) {
      throw ApiError.badRequest("File is required");
    }
    console.log("Donee");
    //Cloudinary upload
    uploadDocumentToCloudinary({
      buffer: req.file.buffer,
      originalFileName: req.file.originalname,
    });

    return ApiResponse.ok(res, "File uploaded", {
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
}
