import axiosInstance from "@/api/axios-instance";
import type { TownshipType, TownshipQueryType } from "@/types/township";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";
import type { TownshipFormValues } from "@/lib/validation/township.schema";

export const getTownships = async (
  queryParams: TownshipQueryType,
): Promise<PaginationResponse<TownshipType[]>> => {
  const response = await axiosInstance.get("/admin/townships", {
    params: queryParams,
  });
  return response.data;
};

export const createTownship = async (
  payload: TownshipFormValues,
): Promise<BaseResponse<TownshipType>> => {
  const response = await axiosInstance.post("/admin/townships", payload);
  return response.data;
};

export const updateTownship = async (
  id: number,
  payload: Partial<TownshipFormValues>,
): Promise<BaseResponse<TownshipType>> => {
  const response = await axiosInstance.patch(`/admin/townships/${id}`, payload);
  return response.data;
};

export const deleteTownship = async (
  id: number,
): Promise<BaseResponse<null>> => {
  const response = await axiosInstance.delete(`/admin/townships/${id}`);
  return response.data;
};
