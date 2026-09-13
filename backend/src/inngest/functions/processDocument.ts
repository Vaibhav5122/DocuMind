import { Document } from "../../app/models/documents.model.js";
import { downloadDocumentFromCloudinary } from "../../app/services/document-download.service.js";
import { extractTextFromDocument } from "../../app/services/document-extraction.service.js";
import { ApiError } from "../../app/utils/ApiError.js";
import { inngest } from "../client.js";

export const processDocument = inngest.createFunction(
  { id: "process-document", triggers: [{ event: "document/uploaded" }] },
  async ({ event, step }) => {
    const { documentId, userId } = event.data;

    // console.log("📄 Processing document");
    // console.log("Document ID:", documentId);
    // console.log("User ID:", userId);

    // #1 Step Get Document from db
    const document = await step.run("get-document", async () => {
      return Document.findOne({
        _id: documentId,
        userId,
      })
        .select(
          "_id userId cloudinaryPublicId cloudinaryUrl mimeType size status",
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

    console.log("📄 Text extracted successfully");
    console.log("Document:", documentId);
    console.log("Characters:", extractedText.length);
    console.log("Extracted text", extractedText);

    return {
      documentId,
      userId,
      status: "TEXT_EXTRACTED",
      characterCount: extractedText.length,
    };
  },
);
