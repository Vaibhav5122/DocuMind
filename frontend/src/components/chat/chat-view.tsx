"use client";

import React, { useState, useRef } from "react";
import {
  PanelLeftOpen,
  PanelRightOpen,
  Plus,
  Sparkles,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatDocuments, useUploadDocument } from "@/lib/hooks/chat/useChatDocuments";
import { useCurrentSession } from "@/lib/hooks/auth/useAuth";
import { useDocumentSelection } from "@/lib/hooks/chat/useDocumentSelection";
import { useChatStream } from "@/lib/hooks/chat/useChatStream";
import {
  useGetConversations,
  useDeleteConversation,
  conversationKeys,
} from "@/lib/hooks/chat/useChatConversations";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axiosClient";
import { ChatHistorySidebar } from "./chat-history-sidebar";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { validateFile, ALLOWED_EXTENSIONS } from "@/lib/validations/fileValidation";
import { toast } from "sonner";
import type { ReferencedDoc, ChatMessage, Citation } from "@/types/chat";

export function ChatView() {
  const queryClient = useQueryClient();
  const { data: userSession } = useCurrentSession();
  const { documents = [], isLoading: isLoadingDocs } = useChatDocuments();
  const { uploadDocument, isPending: isUploadingDoc } = useUploadDocument();

  // Conversations history state
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useGetConversations();
  const {
    mutate: deleteConversationMutate,
    isPending: isDeletingConv,
    variables: deletingConvId,
  } = useDeleteConversation();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );

  // Sidebar toggle states
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(true);
  const [isMobileDocsOpen, setIsMobileDocsOpen] = useState(false);

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

  // Chat streaming management with active conversation support
  const {
    messages,
    loadMessages,
    isStreaming,
    sendMessage,
    stopStreaming,
    clearMessages,
    regenerateLastMessage,
  } = useChatStream({
    conversationId: activeConversationId,
    onConversationCreated: (newConvId) => {
      setActiveConversationId(newConvId);
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });

  // Switch to a conversation from history
  const handleSelectConversation = async (convId: string) => {
    if (convId === activeConversationId) return;
    stopStreaming();
    setActiveConversationId(convId);

    try {
      const res = await apiClient.get(`/conversations/${convId}`);
      const historyData = res.data?.data;
      if (historyData?.messages) {
        interface RawBackendMessage {
          _id: string;
          role: string;
          content: string;
          citations?: Citation[];
          createdAt: string;
        }

        const formattedMessages: ChatMessage[] = historyData.messages.map(
          (m: RawBackendMessage) => ({
            id: m._id,
            role: m.role.toLowerCase() as "user" | "assistant",
            content: m.content,
            citations: m.citations,
            createdAt: new Date(m.createdAt).getTime(),
          }),
        );
        loadMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
      toast.error("Failed to load conversation messages");
    }
  };

  // Start new conversation
  const handleNewChat = () => {
    stopStreaming();
    clearMessages();
    setActiveConversationId(null);
  };

  // Delete conversation
  const handleDeleteConversation = (convId: string) => {
    deleteConversationMutate(convId, {
      onSuccess: () => {
        if (activeConversationId === convId) {
          handleNewChat();
        }
      },
    });
  };

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

  const currentConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  return (
    <div className="w-full flex-1 px-2 sm:px-4 lg:px-6 pb-2 sm:pb-4 flex flex-col h-[calc(100dvh-4.5rem)] sm:h-[calc(100dvh-5.5rem)] min-h-[560px]">
      <div className="relative flex flex-1 w-full mx-auto rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Hidden file input for sidebar upload */}
        <input
          ref={sidebarFileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={handleSidebarFileChange}
        />

        {/* 1. LEFT SIDEBAR: Chat History */}
        <ChatHistorySidebar
          conversations={conversations}
          isLoading={isLoadingConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          isDeletingId={isDeletingConv ? (deletingConvId as string) : null}
          isOpen={isHistoryOpen}
          onToggleOpen={() => setIsHistoryOpen(!isHistoryOpen)}
          isMobileOpen={isMobileHistoryOpen}
          onMobileClose={() => setIsMobileHistoryOpen(false)}
        />

        {/* 2. CENTER: Main Chat Pane */}
        <div className="flex flex-1 flex-col min-w-0 bg-background/50 relative h-full">
          {/* Chat Top Bar */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-border/80 bg-card/60 backdrop-blur-md z-10">
            {/* Left Top Bar: History toggles & conversation title */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Desktop button to reopen History sidebar if closed */}
              {!isHistoryOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex shrink-0 cursor-pointer"
                  onClick={() => setIsHistoryOpen(true)}
                  title="Open chat history"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              )}

              {/* Mobile History trigger */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground md:hidden shrink-0 cursor-pointer"
                onClick={() => setIsMobileHistoryOpen(true)}
                title="Open chat history"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>History</span>
              </Button>

              {/* Current Title */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                <span className="font-semibold text-sm text-foreground truncate flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 hidden sm:inline" />
                  <span className="truncate max-w-[180px] sm:max-w-[320px]">
                    {currentConversation?.title || "New Chat"}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs hidden lg:inline">•</span>
                <span className="text-xs text-muted-foreground truncate hidden lg:inline">
                  {selectedDocIds.length === 0 ? (
                    <span>All documents context</span>
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

            {/* Right Top Bar: New Chat & Knowledge Base Docs toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                disabled={isStreaming}
                className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer hidden sm:flex"
                title="Start new conversation"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </Button>

              {/* Mobile Knowledge Base trigger */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground md:hidden shrink-0 cursor-pointer"
                onClick={() => setIsMobileDocsOpen(true)}
                title="Open knowledge base documents"
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Docs</span>
                {selectedDocIds.length > 0 && (
                  <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                    {selectedDocIds.length}
                  </span>
                )}
              </Button>

              {/* Desktop button to reopen Docs sidebar if closed */}
              {!isDocsOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden md:flex shrink-0 cursor-pointer"
                  onClick={() => setIsDocsOpen(true)}
                  title="Open knowledge base documents"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Docs</span>
                  {selectedDocIds.length > 0 && (
                    <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {selectedDocIds.length}
                    </span>
                  )}
                  <PanelRightOpen className="h-3.5 w-3.5 ml-0.5" />
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

          {/* Chat Input */}
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

        {/* 3. RIGHT SIDEBAR: Knowledge Base / Document Selector */}
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
          isOpen={isDocsOpen}
          onToggleOpen={() => setIsDocsOpen(!isDocsOpen)}
          isMobileOpen={isMobileDocsOpen}
          onMobileClose={() => setIsMobileDocsOpen(false)}
        />
      </div>
    </div>
  );
}
