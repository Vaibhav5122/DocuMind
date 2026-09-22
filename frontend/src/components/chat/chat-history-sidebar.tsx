"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  PanelLeftClose,
  X,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConversationItem } from "@/types/chat";

interface ChatHistorySidebarProps {
  conversations: ConversationItem[];
  isLoading: boolean;
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isDeletingId?: string | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function ChatHistorySidebar({
  conversations,
  isLoading,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isDeletingId,
  isOpen,
  onToggleOpen,
  isMobileOpen = false,
  onMobileClose,
}: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
      {/* Sidebar Top: Header & New Chat */}
      <div className="p-3 border-b border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-semibold text-sm tracking-tight text-foreground">
              Chat History
            </h2>
            <span className="text-[11px] font-medium px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
              {conversations.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex cursor-pointer"
              onClick={onToggleOpen}
              title="Collapse chat history"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
            {onMobileClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden cursor-pointer"
                onClick={onMobileClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* "+ New Chat" Button */}
        <Button
          onClick={() => {
            onNewChat();
            if (isMobileOpen && onMobileClose) onMobileClose();
          }}
          className="w-full h-9 gap-2 font-semibold text-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </Button>

        {/* Search input if multiple conversations exist */}
        {conversations.length > 2 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs bg-background/70 border-border/80 rounded-lg focus-visible:ring-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1 scrollbar-thin">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading history...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center text-muted-foreground space-y-2">
            <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-5 w-5 opacity-40" />
            </div>
            <p className="text-xs font-medium">
              {searchQuery ? "No matching conversations" : "No conversation history yet"}
            </p>
            <p className="text-[11px] text-muted-foreground/80 max-w-[170px]">
              {searchQuery
                ? "Try a different search term."
                : "Ask any question about your documents to start."}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv._id;
            const isDeleting = isDeletingId === conv._id;

            return (
              <div
                key={conv._id}
                className={`group relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-2xs border border-primary/20"
                    : "text-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
                }`}
                onClick={() => {
                  onSelectConversation(conv._id);
                  if (isMobileOpen && onMobileClose) onMobileClose();
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isActive ? (
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary animate-pulse" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  )}
                  <span className="truncate flex-1" title={conv.title}>
                    {conv.title || "Untitled Conversation"}
                  </span>
                </div>

                {/* Delete button (visible on hover or active) */}
                <div className="flex items-center shrink-0">
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                      title="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom status badge */}
      <div className="p-2.5 border-t border-border/80 text-[11px] text-muted-foreground/75 flex items-center justify-between px-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="h-3 w-3" />
          <span>Auto-saved</span>
        </span>
        <span>DocuMind</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-20 ${
          isOpen ? "w-64 lg:w-72" : "w-0 border-r-0"
        }`}
      >
        <div className="w-64 lg:w-72 h-full">{content}</div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer Pane */}
          <div className="relative flex flex-col w-[82%] max-w-xs h-full bg-card shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
