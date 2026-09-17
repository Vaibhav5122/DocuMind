import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  Loader2,
  MoreHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { FileIconBadge, StatusBadge } from "./document-badges";
import {
  formatBytes,
  formatDate,
  formatDocumentName,
  resolveFileType,
} from "@/lib/utils/documentFormat";
import type { DocumentItem } from "./types";
import { getDocumentPreviewUrl } from "@/lib/utils/previewUrl";

interface DocumentTableProps {
  documents: DocumentItem[];
  totalCount: number;
  isLoading: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onDeleteDocument: (id: string) => void;
  deletingId?: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onViewDocument?: (id: string) => void;
}

export function DocumentTable({
  documents,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onDeleteDocument,
  deletingId,
  currentPage,
  onPageChange,
  itemsPerPage = 8,
  onViewDocument,
}: DocumentTableProps) {
  const totalPages = Math.ceil(documents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, endIndex);

  const handleViewDocument = (cloudinaryUrl: string, mimeType: string) => {
    const previewUrl = getDocumentPreviewUrl(cloudinaryUrl, mimeType);
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="border border-border/60 shadow-sm">
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
          onValueChange={(val) => {
            if (val) onStatusFilterChange(val);
          }}
        >
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem
              value="Processed"
              className={"text-green-400 hover:text-green-500"}
            >
              Processed
            </SelectItem>
            <SelectItem
              value="Processing"
              className={"text-blue-300 hover:text-blue-500"}
            >
              Processing
            </SelectItem>
            <SelectItem
              value="Failed"
              className={"text-red-400 hover:text-red-500"}
            >
              Failed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-x-auto px-4">
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
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
            ) : documents.length === 0 ? (
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
                      {statusFilter !== "All"
                        ? `No documents with status "${statusFilter}" were found.`
                        : "You haven't uploaded any documents yet. Get started by uploading your first document."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocuments.map((doc) => {
                const fileType = resolveFileType(doc.mimeType);
                const isDeletingThis = deletingId === doc._id;

                return (
                  <TableRow
                    key={doc._id}
                    className={`transition-all duration-200 ${
                      isDeletingThis
                        ? "opacity-40 bg-destructive/5 pointer-events-none"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <TableCell className="font-medium text-sm text-foreground">
                      <div className="flex items-center gap-3">
                        <FileIconBadge type={fileType} />
                        <span className="truncate max-w-[200px]">
                          {doc.originalFileName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDocumentName(doc.originalFileName)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {fileType}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatBytes(doc.size)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(doc.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isDeletingThis ? (
                        <div className="flex justify-end p-2">
                          <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                handleViewDocument(
                                  doc.cloudinaryUrl,
                                  doc.mimeType,
                                );
                              }}
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => onDeleteDocument(doc._id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && documents.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-muted-foreground">
          <p>
            Showing {startIndex + 1} to {Math.min(endIndex, documents.length)}{" "}
            of {documents.length} documents
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;

              return (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className={`h-8 w-8 ${
                    isActive
                      ? "bg-neutral-900 text-white hover:bg-neutral-800"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
