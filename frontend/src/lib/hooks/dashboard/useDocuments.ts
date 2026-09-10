import { apiClient } from "@/lib/api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetAllDocument(status: string, page: number) {
  return useQuery({
    queryKey: ["documents", { status, page }],
    queryFn: async () => {
      const response = await apiClient.get("/documents");
      console.log(response.data);
      return response.data;
    },
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.documents?.some(
        (doc: any) => doc.status === "Processing",
      );
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

      const { data } = await apiClient.post("/documents", formData);
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
