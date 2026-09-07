import mongoose, { type InferSchemaType } from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADED",
      index: true,
    },
    failureReason: {
      type: String,
      default: null,
    },
    pageCount: {
      type: Number,
      default: null,
    },
    chunkCount: {
      type: Number,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export type DocumentType = InferSchemaType<typeof documentSchema>;

export const Document = mongoose.model("Document", documentSchema);
