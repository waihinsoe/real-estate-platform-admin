"use client";

import {
  login as loginApi,
  logout as logoutApi,
  getMe,
  refreshAccessToken,
} from "@/api/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginFormValues } from "@/lib/validation/auth.schema";

const authKeys = {
  me: ["auth", "me"] as const,
};

// 1. Independent Query Hook
export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const response = await getMe();
      useAuthStore.getState().setUser(response.data);
      return response;
    },
    retry: false,
  });
};

// 2. Independent Login Mutation Hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginFormValues) => loginApi(payload),
    onSuccess: (response) => {
      login(response.data.user, response.data.access_token);
      queryClient.setQueryData(authKeys.me, {
        status_code: response.status_code,
        message: response.message,
        data: response.data.user,
      });
    },
  });
};

// 3. Independent Logout Mutation Hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      logout();
      // Clear user session cache entirely
      queryClient.removeQueries({ queryKey: authKeys.me });
      queryClient.setQueryData(authKeys.me, undefined);
    },
  });
};

export const useRefreshAccessToken = () => {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => refreshAccessToken(),
    onSuccess: (response) => {
      setAccessToken(response.data.access_token);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: () => {
      logout();
      queryClient.removeQueries({ queryKey: authKeys.me });
      queryClient.setQueryData(authKeys.me, undefined);
    },
  });
};
