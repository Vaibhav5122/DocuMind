import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText,
  XCircle,
} from "lucide-react";
import type { DocumentStatus, FileExtension } from "./types";

export function FileIconBadge({ type }: { type: FileExtension }) {
  switch (type) {
    case "PDF":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-rose-50 text-rose-500 shrink-0">
          <FileText className="h-4 w-4" />
        </div>
      );
    case "DOCX":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-500 shrink-0">
          <FileText className="h-4 w-4" />
        </div>
      );
    case "XLSX":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-600 shrink-0">
          <FileSpreadsheet className="h-4 w-4" />
        </div>
      );
    case "TXT":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-500 shrink-0">
          <FileText className="h-4 w-4" />
        </div>
      );
  }
}

export function StatusBadge({ status }: { status: DocumentStatus | string }) {
  switch (status) {
    case "UPLOADED":
    case "READY":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Processed
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          <Clock className="h-3 w-3" />
          Processing
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600">
          <XCircle className="h-3 w-3" />
          Failed
        </span>
      );
    default:
      return null;
  }
}
