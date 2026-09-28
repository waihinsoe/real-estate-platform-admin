import axiosInstance from "@/api/axios-instance";
import type {
  Property,
  PropertyImage,
  PropertyImageInput,
  PropertyQueryType,
} from "@/types/property";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";
import type { PropertyFormValues } from "@/lib/validation/property.schema";

export const getProperties = async (
  queryParams: PropertyQueryType,
): Promise<PaginationResponse<Property[]>> => {
  const response = await axiosInstance.get("/admin/properties", {
    params: queryParams,
  });
  return response.data;
};

export const getProperty = async (
  id: number,
): Promise<BaseResponse<Property>> => {
  const response = await axiosInstance.get(`/admin/properties/${id}`);
  return response.data;
};

export const createProperty = async (
  payload: PropertyFormValues,
): Promise<BaseResponse<Property>> => {
  const response = await axiosInstance.post("/admin/properties", payload);
  return response.data;
};

export const updateProperty = async (
  id: number,
  payload: Partial<PropertyFormValues>,
): Promise<BaseResponse<Property>> => {
  const response = await axiosInstance.patch(
    `/admin/properties/${id}`,
    payload,
  );
  return response.data;
};

export const deleteProperty = async (
  id: number,
): Promise<BaseResponse<null>> => {
  const response = await axiosInstance.delete(`/admin/properties/${id}`);
  return response.data;
};

export const getPropertyImages = async (
  id: number,
): Promise<BaseResponse<PropertyImage[]>> => {
  const response = await axiosInstance.get(`/admin/properties/${id}/images`);
  return response.data;
};

export const updatePropertyImages = async (
  id: number,
  images: PropertyImageInput[],
): Promise<BaseResponse<PropertyImage[]>> => {
  const response = await axiosInstance.put(`/admin/properties/${id}/images`, {
    images,
  });
  return response.data;
};
