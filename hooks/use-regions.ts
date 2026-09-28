"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "@/api/region";
import type { RegionQueryType } from "@/types/region";
import type { RegionFormValues } from "@/lib/validation/region.schema";

const regionKeys = {
  all: ["regions"] as const,
  list: (queryParams: RegionQueryType) => ["regions", queryParams] as const,
};

export const useRegions = (queryParams: RegionQueryType) =>
  useQuery({
    queryKey: regionKeys.list(queryParams),
    queryFn: () => getRegions(queryParams),
  });

export const useCreateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRegion,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: regionKeys.all }),
  });
};

export const useUpdateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<RegionFormValues>;
    }) => updateRegion(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: regionKeys.all }),
  });
};

export const useDeleteRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRegion,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: regionKeys.all }),
  });
};
