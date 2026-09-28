import type { SortDirection } from "./query-type";

export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "CLOSED",
  "VIEWING_SCHEDULED",
  "SPAM",
] as const;
export const INQUIRY_TYPES = ["GENERAL", "VIEWING", "CALL_REQUEST"] as const;
export const INQUIRY_SOURCES = [
  "WEBSITE",
  "PHONE",
  "VIBER",
  "TELEGRAM",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export type InquiryType = (typeof INQUIRY_TYPES)[number];
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export interface InquiryActivity {
  id: number;
  activity_type: string;
  note: string;
  next_follow_up_at?: string | null;
  created_at?: string;
}

export const INQUIRY_SORT_FIELDS = [
  "id", "name", "phone", "status", "inquiry_type", "source",
  "property_id", "assigned_to_admin_id",
] as const;
export type InquirySortBy = (typeof INQUIRY_SORT_FIELDS)[number];

export interface Inquiry {
  id: number;
  status: InquiryStatus;
  inquiry_type: InquiryType;
  source: InquirySource;
  property_id: number | null;
  assigned_to_admin_id: number | null;
  name?: string;
  phone?: string;
  email?: string | null;
  message?: string | null;
  created_at?: string;
  updated_at?: string;
  property?: {
    id: number;
    code: string;
    title: string;
    slug: string;
  } | null;
  assigned_to_admin?: {
    id: number;
    name: string;
    email: string;
  } | null;
  activities?: InquiryActivity[];
}

export interface InquiryQueryType {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: InquirySortBy;
  sort_direction?: SortDirection;
  status?: InquiryStatus;
  inquiry_type?: InquiryType;
  source?: InquirySource;
  property_id?: number;
  assigned_to_admin_id?: number;
  include_activities?: boolean;
}

export interface UpdateInquiryPayload {
  status?: InquiryStatus;
  assigned_to_admin_id?: number;
}

export interface CreateInquiryActivityPayload {
  activity_type: "NOTE";
  note: string;
  next_follow_up_at?: string;
}
