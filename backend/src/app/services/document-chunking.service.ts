import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

interface ChunkDocumentInput {
  text: string;
  documentId: string;
  userId: string;
  source: string;
}

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  //   separators: ["\n\n", "\n", " ", ".", ","],
});

export async function chunkDocument({
  text,
  documentId,
  userId,
  source,
}: ChunkDocumentInput): Promise<Document[]> {
  const documents = await textSplitter.createDocuments(
    [text],
    [{ documentId, userId, source }],
  );
  const chunkWithMetadata = documents.map((doc, idx) => {
    return new Document({
      pageContent: doc.pageContent,
      metadata: { ...doc.metadata, chunkIndex: idx },
    });
  });
  return chunkWithMetadata;
}
