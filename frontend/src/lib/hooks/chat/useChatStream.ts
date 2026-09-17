"use client";

import { useState, useRef, useCallback } from "react";
import type { ChatMessage, ReferencedDoc, StreamEvent } from "@/types/chat";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
  }, []);

  const clearMessages = useCallback(() => {
    stopStreaming();
    setMessages([]);
    setError(null);
  }, [stopStreaming]);

  const sendMessage = useCallback(
    async (query: string, referencedDocs: ReferencedDoc[] = []) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery || isStreaming) return;

      stopStreaming();
      setError(null);

      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `asst-${Date.now() + 1}`;

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: trimmedQuery,
        referencedDocs: referencedDocs.length > 0 ? referencedDocs : undefined,
        createdAt: Date.now(),
      };

      const assistantPlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        citations: [],
        isStreaming: true,
        isThinking: true,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);
      setIsThinking(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const docIds = referencedDocs.map((d) => d.id);
        const documentIdPayload =
          docIds.length === 0
            ? undefined
            : docIds.length === 1
              ? docIds[0]
              : docIds;

        const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: abortController.signal,
          body: JSON.stringify({
            query: trimmedQuery,
            documentId: documentIdPayload,
          }),
        });

        if (!response.ok) {
          let errorText = `Request failed (${response.status})`;
          try {
            const errJson = await response.json();
            errorText = errJson.message || errorText;
          } catch {
            // fallback if response isn't JSON
          }
          throw new Error(errorText);
        }

        if (!response.body) {
          throw new Error("No readable stream response from server");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep whatever incomplete line remains in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) continue;

            const jsonStr = trimmedLine.replace(/^data:\s*/, "");
            if (!jsonStr) continue;

            try {
              const event: StreamEvent = JSON.parse(jsonStr);

              if (event.type === "citations") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, citations: event.citations }
                      : msg,
                  ),
                );
              } else if (event.type === "token") {
                setIsThinking(false);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          isThinking: false,
                          content: msg.content + event.text,
                        }
                      : msg,
                  ),
                );
              } else if (event.type === "done") {
                setIsStreaming(false);
                setIsThinking(false);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, isStreaming: false, isThinking: false }
                      : msg,
                  ),
                );
              } else if (event.type === "error") {
                setIsStreaming(false);
                setIsThinking(false);
                setError(event.message);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          isStreaming: false,
                          isThinking: false,
                          error: event.message,
                          content:
                            msg.content ||
                            event.message ||
                            "Could not generate an answer.",
                        }
                      : msg,
                  ),
                );
              }
            } catch (parseErr) {
              console.warn("Could not parse SSE chunk:", jsonStr, parseErr);
            }
          }
        }
      } catch (err: unknown) {
        const isAbort =
          err instanceof Error && err.name === "AbortError";
        if (isAbort) {
          // Stream cancelled by user
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    isStreaming: false,
                    isThinking: false,
                    content: msg.content || "Generation stopped by user.",
                  }
                : msg,
            ),
          );
        } else {
          const errMsg =
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.";
          setError(errMsg);
          toast.error(errMsg);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    isStreaming: false,
                    isThinking: false,
                    error: errMsg,
                    content:
                      msg.content ||
                      "Failed to receive response from DocuMind. Please check your connection or try again.",
                  }
                : msg,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, stopStreaming],
  );

  const regenerateLastMessage = useCallback(() => {
    // Find the last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMessage) return;

    // Remove the last assistant message if it exists
    setMessages((prev) => {
      const copy = [...prev];
      if (copy.length > 0 && copy[copy.length - 1].role === "assistant") {
        copy.pop();
      }
      return copy;
    });

    sendMessage(
      lastUserMessage.content,
      lastUserMessage.referencedDocs ?? [],
    );
  }, [messages, sendMessage]);

  return {
    messages,
    isStreaming,
    isThinking,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
    regenerateLastMessage,
  };
}
