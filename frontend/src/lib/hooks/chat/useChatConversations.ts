import { apiClient } from "@/lib/api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ConversationItem, Citation } from "@/types/chat";

export interface BackendMessage {
  _id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface ConversationHistoryResponse {
  conversation: ConversationItem;
  messages: BackendMessage[];
}

export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
};

// 1. Fetch all conversations for the user
export function useGetConversations() {
  return useQuery<ConversationItem[]>({
    queryKey: conversationKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get("/conversations");
      return (response.data?.data || []) as ConversationItem[];
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

// 2. Fetch messages for a specific conversation
export function useGetConversationHistory(conversationId: string | null) {
  return useQuery<ConversationHistoryResponse>({
    queryKey: conversationKeys.detail(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("No conversation ID provided");
      }
      const response = await apiClient.get(`/conversations/${conversationId}`);
      return response.data?.data as ConversationHistoryResponse;
    },
    enabled: Boolean(conversationId),
    staleTime: 1000 * 60 * 5,
  });
}

// 3. Create a new conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: { title?: string; query?: string }) => {
      const response = await apiClient.post("/conversations", payload || {});
      return response.data?.data as ConversationItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create conversation";
      toast.error(msg);
    },
  });
}

// 4. Delete a conversation with optimistic updates
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await apiClient.delete(`/conversations/${conversationId}`);
      return response.data;
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: conversationKeys.lists() });

      const previousConversations = queryClient.getQueryData<ConversationItem[]>(
        conversationKeys.lists(),
      );

      if (previousConversations) {
        queryClient.setQueryData(
          conversationKeys.lists(),
          previousConversations.filter((c) => c._id !== deletedId),
        );
      }

      return { previousConversations };
    },
    onError: (error: unknown, _deletedId, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          conversationKeys.lists(),
          context.previousConversations,
        );
      }
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete conversation";
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success("Conversation deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
