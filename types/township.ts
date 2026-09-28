import type { QueryType } from "./query-type";
import { RegionType } from "./region";

export interface TownshipType {
  id: number;
  region_id: number;
  name_mm: string;
  name_en: string;
  slug: string;
  created_at: string;
  updated_at: string;
  region: RegionType;
  _count: {
    properties: number;
  };
}

export type TownshipSortableField =
  | "id"
  | "name_en"
  | "name_mm"
  | "slug"
  | "region_id";
export type TownshipQueryType = QueryType<TownshipSortableField> & {
  region_id?: number;
};
