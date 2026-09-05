import { apiClient } from "@/lib/api/axiosClient";
import { getSession, signIn } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCurrentSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await getSession();
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: any) => {
      const response = await signIn.email(values);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login success");
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    },
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async ({ callbackURL }: { callbackURL?: string } = {}) => {
      await signIn.social({
        provider: "google",
        callbackURL: callbackURL || window.location.href + "/dashboard",
      });
    },
  });
}
