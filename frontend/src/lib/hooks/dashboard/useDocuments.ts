import { apiClient } from "@/lib/api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Centralized Query Keys
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  detail: (id: string) => [...documentKeys.all, "detail", id] as const,
};

// 1. Fetch all documents with live polling for processing states
export function useGetAllDocument() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get("/documents");
      return (response.data?.data || []) as any[];
    },
    refetchInterval: (query) => {
      const docs = query.state.data;
      const hasProcessing =
        Array.isArray(docs) &&
        docs.some((doc: any) => doc.status === "PROCESSING");
      return hasProcessing ? 4000 : false;
    },
    staleTime: 1000 * 60 * 3, // Data stays fresh for 3 minutes
    gcTime: 1000 * 60 * 10, // Cached for 10 minutes
  });
}

// 2. Fetch single document by ID
export function useGetDocumentById(id?: string) {
  return useQuery({
    queryKey: documentKeys.detail(id || ""),
    queryFn: async () => {
      const { data } = await apiClient.get(`/documents/${id}`);
      return data?.data || data;
    },
    enabled: Boolean(id), // Prevents request from firing until an ID is supplied
    staleTime: 1000 * 60 * 5,
  });
}

// 3. Upload document mutation
export function usePostDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post("/documents", formData, {
        headers: {
          "Content-Type": undefined, // Required for proper multipart boundary
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to upload document";
      toast.error(msg);
    },
  });
}

// 4. Delete document with instant Optimistic Updates
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/documents/${id}`);
      return data;
    },
    // Instant UI update before backend response arrives
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: documentKeys.lists() });

      // Snapshot the previous documents list
      const previousDocuments = queryClient.getQueryData<any[]>(
        documentKeys.lists(),
      );

      // Optimistically remove the deleted document from the cache
      if (previousDocuments) {
        queryClient.setQueryData(
          documentKeys.lists(),
          previousDocuments.filter((doc) => doc._id !== deletedId),
        );
      }

      return { previousDocuments };
    },
    // If the server returns an error, roll back to snapshot
    onError: (error: any, _deletedId, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          documentKeys.lists(),
          context.previousDocuments,
        );
      }
      const msg = error.response?.data?.message || "Failed to delete document";
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success("Document deleted");
    },
    // Always sync cache with backend on settle
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
