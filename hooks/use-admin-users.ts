"use client";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/api/admin-user";
import type { AdminQueryType } from "@/types/admin-user";
import type { CreateAdminFormValues } from "@/lib/validation/admin.schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store";

const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (query: AdminQueryType) => ["admin-users", query] as const,
};

export const useAdminUsers = (query: AdminQueryType) => {
  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: () => getAdminUsers(query),
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminFormValues) => createAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateAdminFormValues>;
    }) => updateAdminUser(id, payload),
    onSuccess: async (response, { id }) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id === id) {
        useAuthStore.getState().setUser({ ...currentUser, ...response.data });
        queryClient.setQueryData(["auth", "me"], response);
      }
      await queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
};
