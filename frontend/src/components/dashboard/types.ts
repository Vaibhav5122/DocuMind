export type DocumentStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type FileExtension = "PDF" | "DOCX" | "XLSX" | "TXT";

export interface DocumentItem {
  _id: string;
  name?: string;
  originalFileName: string;
  cloudinaryUrl: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  Processed: number;
  Processing: number;
  Failed: number;
}
