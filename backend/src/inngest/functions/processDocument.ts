import { Document } from "../../app/models/documents.model.js";
import { chunkDocument } from "../../app/services/document-chunking.service.js";
import { downloadDocumentFromCloudinary } from "../../app/services/document-download.service.js";
import { extractTextFromDocument } from "../../app/services/document-extraction.service.js";
import { indexDocumentChunks } from "../../app/services/pinecone/indexing.service.js";
import { ApiError } from "../../app/utils/ApiError.js";
import { inngest } from "../client.js";

export const processDocument = inngest.createFunction(
  {
    id: "process-document",
    triggers: [{ event: "document/uploaded" }],
    onFailure: async ({ event, error, step }) => {
      const { documentId, userId } = event.data.event.data;

      await step.run("mark-document-failed", async () => {
        await Document.updateOne(
          {
            _id: documentId,
            userId,
          },
          {
            $set: {
              status: "FAILED",
              failureReason: error.message,
              processedAt: null,
            },
          },
        );
      });
    },
  },

  async ({ event, step }) => {
    const { documentId, userId } = event.data;

    // #1 Step Get Document from db
    const document = await step.run("get-document", async () => {
      return Document.findOne({
        _id: documentId,
        userId,
      })
        .select(
          "_id userId originalFileName cloudinaryPublicId cloudinaryUrl mimeType size status",
        )
        .lean();
    });
    if (!document) {
      throw ApiError.notFound("Document not found");
    }

    // #Step 2 Change status of Document to PROCESSING
    await step.run("mark-document-processing", async () => {
      const result = await Document.updateOne(
        {
          _id: documentId,
          userId,
          status: "UPLOADED",
        },
        {
          $set: {
            status: "PROCESSING",
            failureReason: null,
          },
        },
      );
      if (result.modifiedCount !== 1) {
        throw ApiError.serverError(
          "Document status could not be changed to PROCESSING",
        );
      }
    });

    // #Step 3 Download Document
    const fileBuffer = await step.run("download-document", async () => {
      const buffer = await downloadDocumentFromCloudinary(
        document.cloudinaryUrl,
      );
      return buffer.toString("base64");
    });

    // #Step4 Extract Text
    const extractedText = await step.run("extract-text", async () => {
      const buffer = Buffer.from(fileBuffer, "base64");
      return extractTextFromDocument(buffer, document.mimeType);
    });

    // #Step 5 Split Document using langchain
    const chunks = await step.run("chunk-document", async () => {
      return chunkDocument({
        text: extractedText,
        documentId,
        userId,
        source: document.originalFileName,
      });
    });

    // #Step 6 Pinecone Index
    const indexedChunkCount = await step.run("index-document", async () => {
      return await indexDocumentChunks(chunks);
    });

    // #Step 7 Change status of Document to READY
    await step.run("mark-document-ready", async () => {
      const result = await Document.updateOne(
        {
          _id: documentId,
          userId,
          status: "PROCESSING",
        },
        {
          $set: {
            status: "READY",
            processedAt: new Date(),
            failureReason: null,
            chunkCount: indexedChunkCount,
          },
        },
      );
      if (result.modifiedCount !== 1) {
        throw ApiError.serverError("Failed to mark document as READY");
      }
    });

    console.log("Total chunk", chunks.length);
    console.dir(chunks.slice(0, 3), {
      depth: null,
    });

    return {
      documentId,
      userId,
      status: "READY",
      characterCount: extractedText.length,
      chunkCount: chunks.length,
    };
  },
);
