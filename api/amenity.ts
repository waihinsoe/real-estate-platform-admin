import axiosInstance from "@/api/axios-instance";
import type { Amenity, AmenityQueryType } from "@/types/amenity";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";
import type { AmenityFormValues } from "@/lib/validation/amenity.schema";

export const getAmenities = async (
  queryParams: AmenityQueryType,
): Promise<PaginationResponse<Amenity[]>> => {
  const response = await axiosInstance.get("/admin/amenities", {
    params: queryParams,
  });
  return response.data;
};

export const createAmenity = async (
  payload: AmenityFormValues,
): Promise<BaseResponse<Amenity>> => {
  const response = await axiosInstance.post("/admin/amenities", payload);
  return response.data;
};

export const updateAmenity = async (
  id: number,
  payload: Partial<AmenityFormValues>,
): Promise<BaseResponse<Amenity>> => {
  const response = await axiosInstance.patch(`/admin/amenities/${id}`, payload);
  return response.data;
};

export const deleteAmenity = async (id: number): Promise<BaseResponse<null>> => {
  const response = await axiosInstance.delete(`/admin/amenities/${id}`);
  return response.data;
};
