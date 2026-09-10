"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDocument } from "@/lib/hooks/dashboard/useDocuments";
import { useCurrentSession } from "@/lib/hooks/auth/useAuth";
import { UploadDocumentDialog } from "./uploadDialog";

// --- Types ---
export type DocumentStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type FileExtension = "PDF" | "DOCX" | "XLSX" | "TXT";

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  type: FileExtension;
  size: string;
  status: DocumentStatus;
  uploadedOn: string;
}

export interface DashboardStats {
  total: number;
  processed: number;
  processing: number;
  failed: number;
}

// --- Static Sample Data (Replace with API Response) ---
const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    name: "Machine Learning Notes",
    fileName: "ml-notes.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "UPLOADED",
    uploadedOn: "Jan 15, 2024, 10:24 AM",
  },
  {
    id: "2",
    name: "Project Proposal",
    fileName: "project-proposal.docx",
    type: "DOCX",
    size: "1.1 MB",
    status: "UPLOADED",
    uploadedOn: "Jan 14, 2024, 4:32 PM",
  },
  {
    id: "3",
    name: "Research Paper",
    fileName: "research-paper.pdf",
    type: "PDF",
    size: "3.8 MB",
    status: "PROCESSING",
    uploadedOn: "Jan 13, 2024, 2:18 PM",
  },
  {
    id: "4",
    name: "Data Analysis",
    fileName: "data-analysis.xlsx",
    type: "XLSX",
    size: "856 KB",
    status: "UPLOADED",
    uploadedOn: "Jan 12, 2024, 11:06 AM",
  },
  {
    id: "5",
    name: "Meeting Notes",
    fileName: "meeting-notes.txt",
    type: "TXT",
    size: "24 KB",
    status: "UPLOADED",
    uploadedOn: "Jan 11, 2024, 9:14 AM",
  },
  {
    id: "6",
    name: "System Design",
    fileName: "system-design.pdf",
    type: "PDF",
    size: "4.2 MB",
    status: "FAILED",
    uploadedOn: "Jan 10, 2024, 6:45 PM",
  },
  {
    id: "7",
    name: "Interview Preparation",
    fileName: "interview-prep.docx",
    type: "DOCX",
    size: "1.7 MB",
    status: "PROCESSING",
    uploadedOn: "Jan 9, 2024, 3:21 PM",
  },
  {
    id: "8",
    name: "Product Requirements",
    fileName: "prd.pdf",
    type: "PDF",
    size: "1.9 MB",
    status: "UPLOADED",
    uploadedOn: "Jan 8, 2024, 12:11 PM",
  },
];

// interface DashboardContentProps {
//   userName?: string;
//   isLoading?: boolean;
// }

export function DashboardContent() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: document,
    isPending: isLoading,
    isError,
  } = useGetAllDocument("UPLOADED", 1);
  const { data: user } = useCurrentSession();

  // Compute live statistics
  const stats: DashboardStats = {
    total: documents.length,
    processed: documents.filter((d) => d.status === "UPLOADED").length,
    processing: documents.filter((d) => d.status === "PROCESSING").length,
    failed: documents.filter((d) => d.status === "FAILED").length,
  };

  const filteredDocuments = documents.filter((doc) => {
    if (statusFilter === "all") return true;
    return doc.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.user.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your documents, track processing status, and access your
            knowledge.
          </p>
        </div>
        <Button className="gap-2 bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm shrink-0">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            {/* Total Documents */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Documents
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All your uploaded documents
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Processed */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Processed
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stats.processed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ready to chat
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Processing */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Processing
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stats.processing}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Being processed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Failed */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Failed
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stats.failed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Needs attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 3. Table Container */}
      <Card className="border border-border/60 shadow-sm">
        {/* Table Top Header */}
        <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Your Documents
            </h2>
            <p className="text-sm text-muted-foreground">
              View and manage all your uploaded documents.
            </p>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value) setStatusFilter(value);
            }}
          >
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Table / Loading / Empty States */}
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-y bg-muted/20">
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  File Name
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Size
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Uploaded On
                </TableHead>
                <TableHead className="w-[50px] text-right font-semibold text-xs text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredDocuments.length === 0 ? (
                // Empty State
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <FolderOpen className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground mt-2">
                        No documents found
                      </h3>
                      <p className="text-xs text-muted-foreground text-center">
                        {statusFilter !== "all"
                          ? `No documents with status "${statusFilter}" were found.`
                          : "You haven't uploaded any documents yet. Get started by uploading your first document."}
                      </p>
                      {statusFilter === "all" && (
                        <Button size="sm" className="mt-3 gap-2">
                          <Upload className="h-3.5 w-3.5" />
                          Upload Document
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Active Rows
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30">
                    {/* Document Name & Icon */}
                    <TableCell className="font-medium text-sm text-foreground">
                      <div className="flex items-center gap-3">
                        <FileIconBadge type={doc.type} />
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {doc.fileName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {doc.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {doc.size}
                    </TableCell>
                    {/* Status Badge */}
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {doc.uploadedOn}
                    </TableCell>
                    {/* Row Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 5. Pagination Footer */}
        {!isLoading && filteredDocuments.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-muted-foreground">
            <p>
              Showing 1 to {filteredDocuments.length} of {documents.length}{" "}
              documents
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 bg-neutral-900 text-white hover:bg-neutral-800"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                2
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// --- Helper Components ---

function FileIconBadge({ type }: { type: FileExtension }) {
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

function StatusBadge({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "UPLOADED":
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
  }
}
