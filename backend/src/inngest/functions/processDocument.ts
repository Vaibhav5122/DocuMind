import { inngest } from "../client.js";

export const processDocument = inngest.createFunction(
  { id: "process-document", triggers: [{ event: "document/uploaded" }] },
  async ({ event, step }) => {
    const { documentId, userId } = event.data;

    console.log("📄 Processing document");
    console.log("Document ID:", documentId);
    console.log("User ID:", userId);

    return {
      documentId,
      userId,
      status: "RECEIVED",
    };
  },
);
