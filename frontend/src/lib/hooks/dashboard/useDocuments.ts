import { apiClient } from "@/lib/api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// status: string, page: number
export function useGetAllDocument() {
  return useQuery({
    queryKey: ["documents"], //{ status, page }
    queryFn: async () => {
      const response = await apiClient.get("/documents");
      console.log("resposedata", response.data);
      return (response.data?.data || []) as any[];
    },
    refetchInterval: (query) => {
      const docs = query.state.data;
      const hasProcessing =
        Array.isArray(docs) &&
        docs.some((doc: any) => doc.status === "PROCESSING");
      return hasProcessing ? 4000 : false;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 7,
  });
}

export function usePostDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post("/documents", formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      console.log(data);
      return data;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to upload document";
      toast.error(msg);
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("idd,", id);
      const { data } = await apiClient.delete(`/documents/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Document Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to delete document";
      toast.error(msg);
    },
  });
}

export function useGetDocumentById() {
  return useQuery({
    queryKey: ["documentid"],
    queryFn: async (id) => {
      const { data } = await apiClient.get(`/documents/${id}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 7,
  });
}
