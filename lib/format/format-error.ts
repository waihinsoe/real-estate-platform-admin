import type { ErrorResponse } from "@/types/response-model";
import { AxiosError } from "axios";

export function formatErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse | undefined;
    if (data?.message && Array.isArray(data.message)) {
      return data.message.join(". ");
    }
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    if (data?.error) {
      return data.error;
    }
    return error.message || "An unexpected error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}
