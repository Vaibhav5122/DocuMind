import { Document } from "../../app/models/documents.model.js";
import { ApiError } from "../../app/utils/ApiError.js";
import { inngest } from "../client.js";

export const processDocument = inngest.createFunction(
  { id: "process-document", triggers: [{ event: "document/uploaded" }] },
  async ({ event, step }) => {
    const { documentId, userId } = event.data;

    console.log("📄 Processing document");
    console.log("Document ID:", documentId);
    console.log("User ID:", userId);
    // #1 Step

    const document = await step.run("get-document", async () => {
      return await Document.findOne({
        _id: documentId,
        userId,
      }).select(
        "_id userId cloudinaryPublicId cloudinaryUrl mimeType size status",
      );
    });
    if (!document) {
      throw ApiError.notFound("Document not found");
    }

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

    return {
      documentId,
      userId,
      status: "PROCESSING",
    };
  },
);
