export interface BaseResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T> extends BaseResponse<T> {
  meta: MetaData;
}

export interface MetaData {
  total: number;
  page: number;
  limit: number;
  total_page: number;
}

export interface ErrorResponse {
  status_code: number;
  message: string[];
  error: string;
  timestamp: string;
  path: string;
}
