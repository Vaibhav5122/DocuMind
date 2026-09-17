"use client";

import React, { useState, useRef } from "react";
import {
  PanelLeftOpen,
  Plus,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatDocuments, useUploadDocument } from "@/lib/hooks/chat/useChatDocuments";
import { useCurrentSession } from "@/lib/hooks/auth/useAuth";
import { useDocumentSelection } from "@/lib/hooks/chat/useDocumentSelection";
import { useChatStream } from "@/lib/hooks/chat/useChatStream";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { validateFile, ALLOWED_EXTENSIONS } from "@/lib/validations/fileValidation";
import { toast } from "sonner";
import type { ReferencedDoc } from "@/types/chat";

export function ChatView() {
  const { data: userSession } = useCurrentSession();
  const { documents = [], isLoading: isLoadingDocs } = useChatDocuments();
  const { uploadDocument, isPending: isUploadingDoc } = useUploadDocument();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const sidebarFileInputRef = useRef<HTMLInputElement>(null);

  // Document selection management
  const {
    selectedDocIds,
    selectedDocuments,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredDocuments,
    toggleDocument,
    selectAll,
    clearSelection,
    selectDocument,
    deselectDocument,
  } = useDocumentSelection(documents);

  // Chat streaming management
  const {
    messages,
    isStreaming,
    sendMessage,
    stopStreaming,
    clearMessages,
    regenerateLastMessage,
  } = useChatStream();

  // Handle submit from input bar or starter prompt
  const handleSubmit = (text: string) => {
    const referenced: ReferencedDoc[] = selectedDocuments.map((d) => ({
      id: d._id,
      name: d.name || d.originalFileName,
      originalFileName: d.originalFileName,
    }));
    sendMessage(text, referenced);
  };

  // Handle document upload from sidebar or input
  const handleSidebarUploadClick = () => {
    sidebarFileInputRef.current?.click();
  };

  const handleSidebarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      if (sidebarFileInputRef.current) sidebarFileInputRef.current.value = "";
      return;
    }

    uploadDocument(file, {
      onSuccess: (res: { data?: { id?: string; _id?: string } }) => {
        if (sidebarFileInputRef.current) sidebarFileInputRef.current.value = "";
        const docId = res?.data?.id || res?.data?._id;
        if (docId) {
          selectDocument(docId);
        }
      },
      onError: (err: unknown) => {
        if (sidebarFileInputRef.current) sidebarFileInputRef.current.value = "";
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to upload document";
        toast.error(msg);
      },
    });
  };

  // When a doc is uploaded via chat input attachment
  const handleDocumentUploaded = (newDocId: string) => {
    selectDocument(newDocId);
  };

  const referencedDocItems: ReferencedDoc[] = selectedDocuments.map((d) => ({
    id: d._id,
    name: d.name || d.originalFileName,
    originalFileName: d.originalFileName,
  }));

  return (
    <div className="w-full flex-1 px-3 sm:px-6 lg:px-8 pb-3 sm:pb-5 flex flex-col h-[calc(100dvh-4.5rem)] sm:h-[calc(100dvh-5.5rem)] min-h-[560px]">
      <div className="relative flex flex-1 w-full max-w-7xl mx-auto rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Hidden file input for sidebar upload */}
      <input
        ref={sidebarFileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={handleSidebarFileChange}
      />

      {/* Left Sidebar */}
      <ChatSidebar
        documents={documents}
        isLoading={isLoadingDocs}
        isUploading={isUploadingDoc}
        selectedDocIds={selectedDocIds}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filteredDocuments={filteredDocuments}
        onToggleDocument={toggleDocument}
        onSelectAll={() =>
          selectAll(
            documents
              .filter((d) => d.status === "READY" || d.status === "UPLOADED")
              .map((d) => d._id),
          )
        }
        onClearSelection={clearSelection}
        onUploadClick={handleSidebarUploadClick}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Pane */}
      <div className="flex flex-1 flex-col min-w-0 bg-background/50 relative h-full">
        {/* Chat Area Top Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border/80 bg-card/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle sidebar button (desktop) */}
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex shrink-0 cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
                title="Open knowledge base sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground md:hidden shrink-0 cursor-pointer"
              onClick={() => setIsMobileSidebarOpen(true)}
              title="Open knowledge base"
            >
              <Menu className="h-4 w-4 text-primary" />
              <span>Docs</span>
              {selectedDocIds.length > 0 && (
                <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {selectedDocIds.length}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="font-semibold text-sm text-foreground truncate flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary hidden sm:inline" />
                DocuMind Chat
              </span>
              <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                {selectedDocIds.length === 0 ? (
                  <span className="text-muted-foreground">
                    All documents context
                  </span>
                ) : (
                  <span className="text-primary font-medium">
                    {selectedDocIds.length}{" "}
                    {selectedDocIds.length === 1 ? "document" : "documents"}{" "}
                    referenced
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                disabled={isStreaming}
                className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Start new conversation"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            )}
          </div>
        </div>

        {/* Message Feed */}
        <ChatMessageList
          messages={messages}
          isStreaming={isStreaming}
          selectedDocuments={selectedDocuments}
          onSelectPrompt={handleSubmit}
          onRegenerate={regenerateLastMessage}
          userName={userSession?.user?.name}
        />

        {/* Chat Input Capsule */}
        <ChatInput
          input={inputValue}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          onStop={stopStreaming}
          selectedDocuments={referencedDocItems}
          onRemoveDocument={deselectDocument}
          onDocumentUploaded={handleDocumentUploaded}
        />
      </div>
    </div>
  </div>
  );
}
