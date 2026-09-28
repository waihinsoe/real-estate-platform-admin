export type SortDirection = "asc" | "desc";

export interface QueryType<TSortBy extends string> {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: TSortBy;
  sort_direction?: SortDirection;
}
