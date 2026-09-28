import { config } from "@/lib/config/config";
import { useAuthStore } from "@/store/use-auth-store";
import { BaseResponse } from "@/types/response-model";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

axiosInstance.interceptors.request.use(async (requestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return requestConfig;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<BaseResponse<{ access_token: string }>>("auth/admin/refresh")
      .then((response) => {
        const accessToken = response.data.data.access_token;
        useAuthStore.getState().setAccessToken(accessToken);
        return accessToken;
      })
      .catch(() => {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("auth/admin/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

    return axiosInstance(originalRequest);
  },
);

export default axiosInstance;
