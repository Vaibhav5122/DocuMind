import { apiClient } from "@/lib/api/axiosClient";
import { getSession, signIn, signOut, signUp } from "@/lib/auth-client";
import {
  LoginSchemaValues,
  RegisterSchemaValues,
} from "@/lib/validations/authValidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCurrentSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await getSession();
      if (response.error) throw response.error.message;
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: RegisterSchemaValues) => {
      const { confirmPassword, ...payload } = values;

      const response = await signUp.email(payload);
      if (response.error) {
        toast.error(response.error.message);
        throw response.error.message;
      }
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LoginSchemaValues) => {
      const response = await signIn.email(values);
      if (response.error) {
        toast.error(response.error.message);
        throw response.error.message;
      }
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async ({ callbackURL }: { callbackURL?: string } = {}) => {
      await signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/dashboard`,
      });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      toast.success("Logout Success");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
