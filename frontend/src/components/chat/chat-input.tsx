"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ArrowUp,
  Square,
  Paperclip,
  FileText,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadDocument } from "@/lib/hooks/chat/useChatDocuments";
import { validateFile, ALLOWED_EXTENSIONS } from "@/lib/validations/fileValidation";
import { toast } from "sonner";
import type { ReferencedDoc } from "@/types/chat";

interface ChatInputProps {
  input: string;
  onInputChange: (val: string) => void;
  onSubmit: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  selectedDocuments: ReferencedDoc[];
  onRemoveDocument: (id: string) => void;
  onDocumentUploaded?: (newDocId: string, name: string) => void;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isStreaming,
  onStop,
  selectedDocuments,
  onRemoveDocument,
  onDocumentUploaded,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLocalUploading, setIsLocalUploading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState<string>("");

  const { uploadDocument, isPending: isMutationPending } = useUploadDocument();
  const isUploading = isLocalUploading || isMutationPending;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160,
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (isStreaming) {
      onStop();
      return;
    }
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    onInputChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsLocalUploading(true);
    setUploadingFileName(file.name);

    uploadDocument(file, {
      onSuccess: (res: { data?: { id?: string; _id?: string } }) => {
        setIsLocalUploading(false);
        setUploadingFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success(`"${file.name}" uploaded and attached!`);

        // If returned id, notify parent to auto-select
        const docId = res?.data?.id || res?.data?._id;
        if (docId && onDocumentUploaded) {
          onDocumentUploaded(docId, file.name);
        }
      },
      onError: (err: unknown) => {
        setIsLocalUploading(false);
        setUploadingFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to upload document";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="p-2.5 sm:p-4 bg-background/90 backdrop-blur-md border-t border-border/80">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Active Attached Documents Chips */}
        {(selectedDocuments.length > 0 || isUploading) && (
          <div className="flex flex-wrap items-center gap-1.5 px-1 py-0.5 max-h-24 overflow-y-auto">
            <span className="text-[11px] text-muted-foreground font-medium mr-1 flex items-center gap-1 shrink-0">
              <Sparkles className="h-3 w-3 text-primary" />
              Referencing:
            </span>

            {selectedDocuments.map((doc) => (
              <span
                key={doc.id}
                className="inline-flex items-center gap-1 text-xs py-0.5 pl-2 pr-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium group transition-all"
              >
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {doc.originalFileName || doc.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveDocument(doc.id)}
                  className="rounded-full p-0.5 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  title="Remove reference"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {isUploading && (
              <span className="inline-flex items-center gap-1.5 text-xs py-0.5 px-2.5 rounded-full bg-muted text-muted-foreground border border-border animate-pulse font-medium">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="truncate max-w-[140px]">
                  Uploading {uploadingFileName}...
                </span>
              </span>
            )}
          </div>
        )}

        {/* Input Bar Container */}
        <div className="relative flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all px-2.5 py-1.5">
          {/* File Attachment Input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Attach Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Attach document (PDF, DOCX, TXT)"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>

          {/* Auto-growing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedDocuments.length > 0
                ? `Ask anything about ${
                    selectedDocuments.length === 1
                      ? selectedDocuments[0].originalFileName || "this document"
                      : `${selectedDocuments.length} selected documents`
                  }...`
                : "Ask anything about all your documents..."
            }
            className="flex-1 max-h-40 min-h-[38px] resize-none bg-transparent py-2 px-1 text-sm placeholder:text-muted-foreground/70 focus:outline-hidden text-foreground leading-normal"
          />

          {/* Send or Stop Button */}
          <div className="shrink-0 flex items-center">
            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                onClick={onStop}
                className="h-8 w-8 rounded-full border border-border/80 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
                title="Stop generation"
              >
                <Square className="h-3 w-3 fill-current rounded-xs" />
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                disabled={!input.trim() || isUploading}
                onClick={handleSend}
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
                title="Send question (Enter)"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </Button>
            )}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-center text-muted-foreground/75 px-4 select-none">
          DocuMind AI grounds answers in your documents. Verify important details.
        </p>
      </div>
    </div>
  );
}
