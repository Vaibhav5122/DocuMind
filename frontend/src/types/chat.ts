export interface Citation {
  index: number;
  source: string;
  documentId: string;
  chunkIndex: number;
  score?: number;
}

export interface ReferencedDoc {
  id: string;
  name: string;
  originalFileName: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
  isThinking?: boolean;
  error?: string | null;
  referencedDocs?: ReferencedDoc[];
  createdAt: number;
}

export type StreamEvent =
  | { type: "citations"; citations: Citation[] }
  | { type: "token"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type DocumentStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";

export interface DocumentInfo {
  _id: string;
  name: string;
  originalFileName: string;
  cloudinaryUrl?: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  createdAt: string;
  pageCount?: number | null;
  chunkCount?: number | null;
  failureReason?: string | null;
}
