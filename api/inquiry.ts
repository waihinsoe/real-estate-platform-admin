import axiosInstance from "@/api/axios-instance";
import type {
  Inquiry,
  InquiryActivity,
  InquiryQueryType,
  UpdateInquiryPayload,
  CreateInquiryActivityPayload,
} from "@/types/inquiry";
import type { BaseResponse, PaginationResponse } from "@/types/response-model";

export const getInquiries = async (
  queryParams: InquiryQueryType,
): Promise<PaginationResponse<Inquiry[]>> => {
  const response = await axiosInstance.get("/admin/inquiries", {
    params: queryParams,
  });
  return response.data;
};

export const updateInquiry = async (
  id: number,
  payload: UpdateInquiryPayload,
): Promise<BaseResponse<Inquiry>> => {
  const response = await axiosInstance.patch(`/admin/inquiries/${id}`, payload);
  return response.data;
};

export const createInquiryActivity = async (
  id: number,
  payload: CreateInquiryActivityPayload,
): Promise<BaseResponse<InquiryActivity>> => {
  const response = await axiosInstance.post(
    `/admin/inquiries/${id}/activities`,
    payload,
  );
  return response.data;
};
