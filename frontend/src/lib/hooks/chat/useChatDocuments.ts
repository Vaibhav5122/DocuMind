"use client";

import { useGetAllDocument, usePostDocument } from "@/lib/hooks/dashboard/useDocuments";
import type { DocumentInfo } from "@/types/chat";

/**
 * TanStack Query hook for fetching and managing documents in Chat with caching (staleTime/gcTime)
 */
export function useChatDocuments() {
  const query = useGetAllDocument();

  return {
    documents: (query.data || []) as DocumentInfo[],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * TanStack Mutation hook for uploading documents with onError and onPending state
 */
export function useUploadDocument() {
  const mutation = usePostDocument();

  return {
    uploadDocument: mutation.mutate,
    uploadDocumentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
