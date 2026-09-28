import type { QueryType } from "./query-type";

export interface Amenity {
  id: number;
  name: string;
  slug: string;
}

export type AmenitySortableField = "id" | "name" | "slug";
export type AmenityQueryType = QueryType<AmenitySortableField>;
