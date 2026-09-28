"use client";

import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/api/property";
import type { PropertyQueryType } from "@/types/property";
import type { PropertyFormValues } from "@/lib/validation/property.schema";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const propertyKeys = {
  all: ["properties"] as const,
  list: (query: PropertyQueryType) => ["properties", query] as const,
  detail: (id: number) => ["properties", id] as const,
};

export const useProperties = (query: PropertyQueryType) => {
  return useQuery({
    queryKey: propertyKeys.list(query),
    queryFn: () => getProperties(query),
    placeholderData: keepPreviousData,
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => getProperty(id),
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropertyFormValues) => createProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PropertyFormValues>;
    }) => updateProperty(id, payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
};
