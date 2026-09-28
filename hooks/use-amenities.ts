"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from "@/api/amenity";
import type { AmenityQueryType } from "@/types/amenity";
import type { AmenityFormValues } from "@/lib/validation/amenity.schema";

const amenityKeys = {
  all: ["amenities"] as const,
  list: (queryParams: AmenityQueryType) => ["amenities", queryParams] as const,
};

export const useAmenities = (queryParams: AmenityQueryType) => useQuery({
  queryKey: amenityKeys.list(queryParams),
  queryFn: () => getAmenities(queryParams),
});

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAmenity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: amenityKeys.all }),
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AmenityFormValues> }) => updateAmenity(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: amenityKeys.all }),
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: amenityKeys.all }),
  });
};
