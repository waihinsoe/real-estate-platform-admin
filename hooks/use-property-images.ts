"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPropertyImages, updatePropertyImages } from "@/api/property";
import type { UploadedImage } from "@/types/image-upload";

export function usePropertyImages(propertyId?: number) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<UploadedImage[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const query = useQuery({
    queryKey: ["properties", propertyId, "images"],
    queryFn: () => getPropertyImages(propertyId!),
    enabled: propertyId !== undefined,
  });
  const images = draft ?? [...(query.data?.data ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({ public_id: image.image_public_id, url: image.image_url }));

  const save = useMutation({
    mutationFn: async (id: number) => {
      // Read the authoritative association IDs before replacing the collection.
      const existing = await getPropertyImages(id);
      const selected = draft ?? [...existing.data].sort((a, b) => a.sort_order - b.sort_order).map((image) => ({
        public_id: image.image_public_id,
        url: image.image_url,
      }));
      return updatePropertyImages(id, selected.map((image, index) => {
        const match = existing.data.find((entry) => entry.image_public_id === image.public_id);
        return {
          ...(match ? { id: match.id } : {}),
          public_id: image.public_id,
          url: image.url,
          sort_order: index + 1,
        };
      }));
    },
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    images,
    onChange: setDraft,
    onBusyChange: setUploading,
    loading: propertyId !== undefined && query.isPending,
    error: query.error,
    retry: () => { void query.refetch(); },
    busy: uploading || save.isPending,
    save: save.mutateAsync,
  };
}
