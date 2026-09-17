"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Sparkles,
  FileText,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./markdown-renderer";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  selectedDocuments: { _id: string; originalFileName?: string; name?: string }[];
  onSelectPrompt: (promptText: string) => void;
  onRegenerate: () => void;
  userName?: string;
}

const STARTER_PROMPTS = [
  {
    icon: "📄",
    title: "Summarize document",
    prompt: "Provide a clear and concise summary of the key points in this document.",
  },
  {
    icon: "🔍",
    title: "Extract key takeaways",
    prompt: "What are the most critical takeaways and conclusions from the text?",
  },
  {
    icon: "📋",
    title: "Find action items",
    prompt: "Extract any action items, next steps, or recommendations mentioned.",
  },
  {
    icon: "💡",
    title: "Explain complex concepts",
    prompt: "Explain the main concepts and findings in simple, easy-to-understand terms.",
  },
];

export function ChatMessageList({
  messages,
  isStreaming,
  selectedDocuments,
  onSelectPrompt,
  onRegenerate,
  userName,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new tokens or messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-2xl mx-auto space-y-6">
        {/* Welcome Icon */}
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xs">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How can DocuMind help today?
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {selectedDocuments.length > 0 ? (
              <span>
                Ready to answer questions about{" "}
                <strong className="text-foreground font-semibold">
                  {selectedDocuments.length}{" "}
                  {selectedDocuments.length === 1 ? "document" : "documents"}
                </strong>
                .
              </span>
            ) : (
              <span>
                Ask questions across all your uploaded documents or attach new files below.
              </span>
            )}
          </p>
        </div>

        {/* Currently Referenced Documents Bar */}
        {selectedDocuments.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
            {selectedDocuments.map((doc) => (
              <span
                key={doc._id}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
              >
                <FileText className="h-3 w-3" />
                <span className="truncate max-w-[160px]">
                  {doc.originalFileName || doc.name}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Starter Prompts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
          {STARTER_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40 transition-all text-left group cursor-pointer shadow-2xs"
            >
              <span className="text-xl shrink-0 select-none">{item.icon}</span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                  {item.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth"
    >
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        return (
          <MessageItem
            key={message.id}
            message={message}
            isLast={isLast}
            isStreaming={isStreaming && isLast}
            onRegenerate={onRegenerate}
            userName={userName}
          />
        );
      })}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
}

function MessageItem({
  message,
  isLast,
  isStreaming,
  onRegenerate,
  userName,
}: {
  message: ChatMessage;
  isLast: boolean;
  isStreaming: boolean;
  onRegenerate: () => void;
  userName?: string;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [showCitations, setShowCitations] = useState(false);

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-3xl ml-auto">
        <div className="flex flex-col items-end space-y-1.5 max-w-[85%]">
          {/* Referenced documents chips if user referenced specific docs */}
          {message.referencedDocs && message.referencedDocs.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1 mb-1">
              {message.referencedDocs.map((doc) => (
                <span
                  key={doc.id}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border"
                >
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-[140px]">
                    {doc.originalFileName || doc.name}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* User Bubble */}
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm shadow-2xs break-words">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>

        <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5 text-foreground font-semibold text-xs">
          {userName ? userName.slice(0, 2).toUpperCase() : <User className="h-4 w-4" />}
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex gap-3 max-w-3xl mr-auto group">
      {/* Bot Avatar */}
      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Thinking State */}
        {message.isThinking && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/70 text-xs text-muted-foreground animate-pulse">
            <BrainCircuit className="h-3.5 w-3.5 text-primary animate-spin" />
            <span className="font-medium text-[11px]">
              Thinking & analyzing documents...
            </span>
          </div>
        )}

        {/* Error message */}
        {message.error && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{message.error}</p>
            </div>
          </div>
        )}

        {/* Citations Preview (if available) */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-1.5">
            <button
              onClick={() => setShowCitations(!showCitations)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium bg-muted/40 hover:bg-muted/80 px-2.5 py-1 rounded-md border border-border/60 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>
                {message.citations.length} source
                {message.citations.length > 1 ? "s" : ""} retrieved
              </span>
              {showCitations ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showCitations && (
              <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Referenced Passages
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-background border border-border text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium text-foreground truncate max-w-[150px]">
                          {c.source || "Document"}
                        </span>
                        {c.score !== undefined && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {(c.score * 100).toFixed(0)}% match
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Chunk #{c.chunkIndex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render Message Body */}
        {message.content && (
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer
              content={message.content}
              isStreaming={isStreaming}
            />
          </div>
        )}

        {/* Message Actions (Copy, Regenerate) */}
        {!message.isThinking && !message.isStreaming && message.content && (
          <div className="flex items-center gap-1 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              title="Copy message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>

            {isLast && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={onRegenerate}
                title="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
