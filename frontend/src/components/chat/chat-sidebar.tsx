"use client";

import React from "react";
import {
  Search,
  X,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  Check,
  PanelLeftClose,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DocumentInfo, DocumentStatus } from "@/types/chat";
import { formatBytes, formatDate } from "@/lib/utils/documentFormat";

interface ChatSidebarProps {
  documents: DocumentInfo[];
  isLoading: boolean;
  isUploading?: boolean;
  selectedDocIds: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  filteredDocuments: DocumentInfo[];
  onToggleDocument: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onUploadClick: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function ChatSidebar({
  documents,
  isLoading,
  isUploading = false,
  selectedDocIds,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  filteredDocuments,
  onToggleDocument,
  onSelectAll,
  onClearSelection,
  onUploadClick,
  isOpen,
  onToggleOpen,
  isMobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-sm tracking-tight">
              Knowledge Base
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {documents.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex"
              onClick={onToggleOpen}
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
            {onMobileClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
                onClick={onMobileClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-7 h-8 text-xs rounded-lg bg-background border-border/80 focus-visible:ring-1"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status Filters & Selection Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/60 border border-border/70">
            {(["ALL", "READY", "PROCESSING"] as const).map((st) => (
              <button
                key={st}
                onClick={() => onStatusFilterChange(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div>
            {selectedDocIds.length > 0 ? (
              <button
                onClick={onClearSelection}
                className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:bg-destructive/10 px-2.5 py-1 rounded-md border border-destructive/20 transition-colors cursor-pointer"
              >
                Clear ({selectedDocIds.length})
              </button>
            ) : (
              <button
                onClick={onSelectAll}
                className="text-xs font-semibold text-primary hover:underline px-2 py-1 transition-colors cursor-pointer"
              >
                Select all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Selection Banner */}
      <div className="px-3.5 py-2 bg-muted/40 border-b border-border/60 text-xs flex items-center justify-between">
        <span className="text-muted-foreground">
          {selectedDocIds.length === 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Referencing <strong>all documents</strong>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {selectedDocIds.length} doc{selectedDocIds.length > 1 ? "s" : ""}{" "}
              selected
            </span>
          )}
        </span>
        {selectedDocIds.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            Targeted search
          </span>
        )}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-transparent">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center h-48 space-y-2">
            <FileText className="h-8 w-8 text-muted-foreground/40 stroke-1" />
            <p className="text-xs font-medium">
              {searchQuery
                ? `No documents match "${searchQuery}"`
                : "No documents uploaded yet"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              className="text-xs h-7 gap-1 mt-1"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Upload PDF
            </Button>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const selected = selectedDocIds.includes(doc._id);
            return (
              <DocumentSidebarItem
                key={doc._id}
                document={doc}
                isSelected={selected}
                onToggle={() => onToggleDocument(doc._id)}
              />
            );
          })
        )}
      </div>

      {/* Sidebar Footer: Upload Quick Action */}
      <div className="p-3 border-t border-border bg-card">
        <Button
          onClick={onUploadClick}
          disabled={isUploading}
          className="w-full gap-2 text-xs h-9 justify-center font-medium shadow-xs disabled:opacity-70 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              <span>Uploading document...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              <span>Add / Upload Document</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Desktop View
  return (
    <>
      <aside
        className={`hidden md:block transition-all duration-200 ease-in-out shrink-0 overflow-hidden ${
          isOpen ? "w-80" : "w-0 border-none"
        }`}
      >
        <div className="w-80 h-full">{content}</div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function DocumentSidebarItem({
  document,
  isSelected,
  onToggle,
}: {
  document: DocumentInfo;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left ${
        isSelected
          ? "bg-primary/10 border-primary/40 shadow-xs"
          : "bg-card hover:bg-muted/60 border-border/70 hover:border-border"
      }`}
    >
      {/* Custom Checkbox */}
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 group-hover:border-foreground/60"
        }`}
      >
        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </div>

      {/* Document Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold truncate leading-snug ${
              isSelected ? "text-primary" : "text-foreground"
            }`}
            title={document.originalFileName || document.name}
          >
            {document.originalFileName || document.name}
          </p>
          <StatusBadge status={document.status} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span>{formatBytes(document.size)}</span>
          <span>•</span>
          <span>{formatDate(document.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "READY") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">
        <CheckCircle2 className="h-3 w-3" />
        Ready
      </span>
    );
  }

  if (status === "PROCESSING") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        Indexing
      </span>
    );
  }

  if (status === "UPLOADED") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md shrink-0">
        <Clock className="h-3 w-3" />
        Uploaded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md shrink-0">
      <AlertCircle className="h-3 w-3" />
      Failed
    </span>
  );
}
