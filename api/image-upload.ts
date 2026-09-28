import axiosInstance from "@/api/axios-instance";
import type { UploadedImage } from "@/types/image-upload";
import type { BaseResponse } from "@/types/response-model";

export const uploadImage = async (
  file: File,
): Promise<BaseResponse<UploadedImage>> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post("/admin/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteImage = async (
  publicId: string,
): Promise<BaseResponse<Pick<UploadedImage, "public_id">>> => {
  const response = await axiosInstance.delete("/admin/upload/image", {
    data: { public_id: publicId },
  });
  return response.data;
};
