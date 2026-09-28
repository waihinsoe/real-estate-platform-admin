import type { QueryType } from "./query-type";

export interface RegionType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
  created_at: string;
  updated_at: string;
  _count: {
    townships: number;
    properties: number;
  };
}

export type RegionSortableField = "id" | "name_en" | "name_mm" | "slug";
export type RegionQueryType = QueryType<RegionSortableField>;
