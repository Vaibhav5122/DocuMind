import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import {
  deleteDocumentFromCloudinary,
  uploadDocumentToCloudinary,
} from "../services/cloudinary.service.js";
import { Document } from "../models/documents.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { inngest } from "../../inngest/client.js";

export class DocumentController {
  public async createDocument(req: Request, res: Response) {
    if (!req.file) {
      throw ApiError.badRequest("File is required");
    }

    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.badRequest("Authentication required");
    }

    const { buffer, mimetype, originalname, size } = req.file;

    const fileUpload = await uploadDocumentToCloudinary({
      buffer,
      originalFileName: originalname,
    });

    const document = await Document.create({
      userId,
      name: fileUpload.display_name,
      originalFileName: originalname,
      cloudinaryPublicId: fileUpload.public_id,
      cloudinaryUrl: fileUpload.secure_url,
      mimeType: mimetype,
      size,
      status: "UPLOADED",
    });

    await inngest.send({
      name: "document/uploaded",
      data: { documentId: document._id.toString(), userId },
    });

    return ApiResponse.created(res, "Document Uploaded", {
      id: document.id,
      name: originalname.replace(/\.[^/.]+$/, ""),
      originalFileName: document.originalFileName,
      mimeType: document.mimeType,
      size: document.size,
      status: document.status,
    });
  }
  public async getAllDocument(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }
    const allDocuments = await Document.find({ userId })
      .select(
        "name originalFileName cloudinaryUrl mimeType size status createdAt",
      )
      .sort({
        createdAt: -1,
      });

    return ApiResponse.ok(res, "Documents fetched", allDocuments);
  }

  public async getDocumentById(req: Request, res: Response) {
    const userId = req.user?.id;

    const { documentId } = req.params;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }
    if (!documentId || !mongoose.isValidObjectId(documentId)) {
      throw ApiError.badRequest("Valid documentId required");
    }
    const document = await Document.findOne({ _id: documentId, userId }).select(
      "name originalFileName mimeType size status",
    );
    if (!document) {
      throw ApiError.notFound("Document not found");
    }
    return ApiResponse.ok(res, "Document fetched", document);
  }

  //Delete document by id
  public async deleteDocumentById(req: Request, res: Response) {
    const userId = req.user?.id;
    const { documentId } = req.params;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }
    if (!documentId || !mongoose.isValidObjectId(documentId)) {
      throw ApiError.badRequest("Valid documentId required");
    }

    const document = await Document.findOne({ _id: documentId, userId }).select(
      "cloudinaryPublicId",
    );

    if (!document) {
      throw ApiError.notFound("Document not found to delete");
    }

    await deleteDocumentFromCloudinary(document.cloudinaryPublicId);

    const deleteDocument = await Document.deleteOne({
      _id: documentId,
      cloudinaryPublicId: document.cloudinaryPublicId,
    });

    if (deleteDocument.deletedCount === 0) {
      ApiError.serverError("MongoDB deletion failed");
    }

    return ApiResponse.noContent(res);
  }
}
