import axiosInstance from "@/api/axios-instance";
import type { AdminUserType, AdminQueryType } from "@/types/admin-user";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";
import type { CreateAdminFormValues } from "@/lib/validation/admin.schema";

export const getAdminUsers = async (
  query: AdminQueryType,
): Promise<PaginationResponse<AdminUserType[]>> => {
  const response = await axiosInstance.get("/admins", { params: query });
  return response.data;
};

export const createAdminUser = async (
  payload: CreateAdminFormValues,
): Promise<BaseResponse<AdminUserType>> => {
  const response = await axiosInstance.post("/admins", payload);
  return response.data;
};

export const updateAdminUser = async (
  id: number,
  payload: Partial<CreateAdminFormValues>,
): Promise<BaseResponse<AdminUserType>> => {
  const response = await axiosInstance.patch(`/admins/${id}`, payload);
  return response.data;
};

export const deleteAdminUser = async (
  id: number,
): Promise<BaseResponse<null>> => {
  const response = await axiosInstance.delete(`/admins/${id}`);
  return response.data;
};
