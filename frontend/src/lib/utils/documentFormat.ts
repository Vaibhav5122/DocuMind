import { FileExtension } from "@/components/dashboard/dashboard";

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function resolveFileType(mimeType: string = ""): FileExtension {
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word") || mimeType.includes("officedocument"))
    return "DOCX";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "XLSX";
  return "TXT";
}

export function formatDate(dateString: string): string {
  if (!dateString) return "Just now";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDocumentName(fileName: string = ""): string {
  if (!fileName) return "untitled";

  return fileName
    .replace(/\.[^/.]+$/, "") // Removes the extension (.pdf, .docx, etc.)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, "") // Removes special characters/symbols
    .replace(/\s+/g, "-") // Replaces single or multiple spaces with a single '-'
    .replace(/-+/g, "-"); // Collapses consecutive hyphens into one
}
