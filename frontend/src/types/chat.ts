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

import type { DocumentItem, DocumentStatus } from "@/components/dashboard/types";

export type { DocumentStatus };

export interface DocumentInfo extends DocumentItem {
  pageCount?: number | null;
  chunkCount?: number | null;
  failureReason?: string | null;
}
