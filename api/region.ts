import axiosInstance from "@/api/axios-instance";
import type { RegionType, RegionQueryType } from "@/types/region";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";
import type { RegionFormValues } from "@/lib/validation/region.schema";

export const getRegions = async (
  queryParams: RegionQueryType,
): Promise<PaginationResponse<RegionType[]>> => {
  const response = await axiosInstance.get("/admin/regions", {
    params: queryParams,
  });
  return response.data;
};

export const createRegion = async (
  payload: RegionFormValues,
): Promise<BaseResponse<RegionType>> => {
  const response = await axiosInstance.post("/admin/regions", payload);
  return response.data;
};

export const updateRegion = async (
  id: number,
  payload: Partial<RegionFormValues>,
): Promise<BaseResponse<RegionType>> => {
  const response = await axiosInstance.patch(`/admin/regions/${id}`, payload);
  return response.data;
};

export const deleteRegion = async (id: number): Promise<BaseResponse<null>> => {
  const response = await axiosInstance.delete(`/admin/regions/${id}`);
  return response.data;
};
