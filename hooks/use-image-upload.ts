"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteImage, uploadImage } from "@/api/image-upload";

export const useImageUpload = () => useMutation({
  mutationFn: uploadImage,
  retry: false,
});

export const useDeleteImage = () => useMutation({
  mutationFn: deleteImage,
  retry: false,
});
