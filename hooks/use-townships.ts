"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTownships,
  createTownship,
  updateTownship,
  deleteTownship,
} from "@/api/township";
import type { TownshipQueryType } from "@/types/township";
import type { TownshipFormValues } from "@/lib/validation/township.schema";

const townshipKeys = {
  all: ["townships"] as const,
  list: (queryParams: TownshipQueryType) => ["townships", queryParams] as const,
};

export const useTownships = (queryParams: TownshipQueryType, enabled = true) =>
  useQuery({
    queryKey: townshipKeys.list(queryParams),
    queryFn: () => getTownships(queryParams),
    enabled,
  });

export const useCreateTownship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTownship,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: townshipKeys.all }),
  });
};

export const useUpdateTownship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<TownshipFormValues>;
    }) => updateTownship(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: townshipKeys.all }),
  });
};

export const useDeleteTownship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTownship,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: townshipKeys.all }),
  });
};
