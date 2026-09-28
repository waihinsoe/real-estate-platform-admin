import axiosInstance from "@/api/axios-instance";
import { AdminUserType } from "@/types/admin-user";
import { BaseResponse } from "@/types/response-model";
import { LoginFormValues } from "@/lib/validation/auth.schema";

export const login = async (
  payload: LoginFormValues,
): Promise<
  BaseResponse<{
    access_token: string;
    user: AdminUserType;
  }>
> => {
  const response = await axiosInstance.post("/auth/admin/login", payload);
  return response.data;
};

const login_response = {
  status_code: 200,
  message: "Success",
  data: {
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc4OTM3NzY2NSwiZXhwIjoxNzg5Mzc4NTY1fQ.SSCnrdGnq1PVhekNrUEUsaFjBcSfzJdpThrn-NNHMxM",
    user: {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      role: "SUPER_ADMIN",
    },
  },
};

export const getMe = async (): Promise<BaseResponse<AdminUserType>> => {
  const response = await axiosInstance.get("/auth/admin/me");
  return response.data;
};

const me_response = {
  status_code: 200,
  message: "Success",
  data: {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "SUPER_ADMIN",
    is_active: true,
    created_at: "2026-09-09T15:57:58.422Z",
  },
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/admin/logout");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await axiosInstance.post("/auth/admin/refresh");
  return response.data as BaseResponse<{
    access_token: string;
  }>;
};

const refresh_access_token_response = {
  status_code: 200,
  message: "Success",
  data: {
    access_token: "admin-access-token",
  },
};
