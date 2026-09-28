import type { Amenity } from "./amenity";
import type { RegionType } from "./region";
import type { TownshipType } from "./township";
import type { QueryType } from "./query-type";

export type ListingType = "SALE" | "RENT";

export type PropertyType =
  | "LAND"
  | "HOUSE"
  | "CONDO"
  | "APARTMENT"
  | "SHOP"
  | "OFFICE"
  | "WAREHOUSE";

export type PropertyStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SOLD"
  | "RENTED"
  | "HIDDEN";

export interface PropertyImageInput {
  id?: number;
  public_id: string;
  url: string;
  sort_order: number;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  image_public_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  created_by_admin_id: number;

  region_id: number;
  township_id: number;

  local_area: string | null;

  code: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string;

  listing_type: ListingType;
  property_type: PropertyType;
  status: PropertyStatus;

  price_lakhs: string;
  price_label: string | null;

  property_size: string | null;
  property_features: string | null;

  street: string | null;
  landmark: string | null;
  address_detail: string | null;

  latitude: string | null;
  longitude: string | null;

  contact_phone: string | null;
  contact_viber: string | null;
  contact_telegram: string | null;

  is_featured: boolean;
  view_count: number;

  published_at: string | null;
  created_at: string;
  updated_at: string;

  region: RegionType;
  township: TownshipType;

  images: PropertyImage[];
  amenities: Amenity[];
}

export type PropertySortableField =
  | "id"
  | "code"
  | "title"
  | "price_lakhs"
  | "view_count"
  | "created_at"
  | "updated_at";

export interface PropertyQueryType extends QueryType<PropertySortableField> {
  region_id?: number;
  township_id?: number;
  listing_type?: ListingType;
  property_type?: PropertyType;
  status?: PropertyStatus;
  is_featured?: boolean;
  min_price_lakhs?: number;
  max_price_lakhs?: number;
}
