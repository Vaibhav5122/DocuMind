"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  validateFile,
  ALLOWED_EXTENSIONS,
} from "@/lib/validations/fileValidation";
import { usePostDocument } from "@/lib/hooks/dashboard/useDocuments";

export function UploadDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending } = usePostDocument();

  const handleFile = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    setSelectedFile(file);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Enforce strictly 1 file selection
    if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
      toast.error("Please upload only 1 file at a time");
      return;
    }

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2 bg-neutral-900 text-white hover:bg-neutral-800">
          <UploadCloud className="h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Supported formats: PDF, DOCX, TXT. Maximum file size: 10MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone Container */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/30"
            }`}
          >
            {/* Native file input with strict restrictions */}
            <input
              ref={inputRef}
              type="file"
              // Enforces single file at browser level
              multiple={false}
              // Restricts native OS picker view
              accept={ALLOWED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
                e.target.value = ""; // Reset so the same file can be reselected if removed
              }}
            />

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              Click to browse or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Single file up to 10MB
            </p>
          </div>

          {/* Selected File Preview Box */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-sm">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setSelectedFile(null);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={!selectedFile || isPending} onClick={handleUpload}>
            {isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
