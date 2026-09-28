import { z } from "zod";

const listingTypes = ["SALE", "RENT"] as const;
const propertyTypes = [
  "LAND",
  "HOUSE",
  "CONDO",
  "APARTMENT",
  "SHOP",
  "OFFICE",
  "WAREHOUSE",
] as const;
const propertyStatuses = [
  "DRAFT",
  "PUBLISHED",
  "SOLD",
  "RENTED",
  "HIDDEN",
] as const;

export const PropertySchema = z.object({
  region_id: z.number().int().positive("Region is required"),
  township_id: z.number().int().positive("Township is required"),
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  listing_type: z.enum(listingTypes),
  property_type: z.enum(propertyTypes),
  status: z.enum(propertyStatuses),
  price_lakhs: z.number().positive("Price must be a positive number"),
  price_label: z.string().trim().optional().nullable(),
  property_size: z.string().trim().optional().nullable(),
  property_features: z.string().trim().optional().nullable(),
  local_area: z.string().trim().optional().nullable(),
  street: z.string().trim().optional().nullable(),
  landmark: z.string().trim().optional().nullable(),
  address_detail: z.string().trim().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  contact_phone: z.string().trim().optional().nullable(),
  contact_viber: z.string().trim().optional().nullable(),
  contact_telegram: z.string().trim().optional().nullable(),
  is_featured: z.boolean(),
  amenity_ids: z.array(z.number().int().positive()).optional().nullable(),
  detail: z
    .object({
      land_info: z.string().trim().optional().nullable(),
      ownership_info: z.string().trim().optional().nullable(),
      building_info: z.string().trim().optional().nullable(),
      room_info: z.string().trim().optional().nullable(),
      road_info: z.string().trim().optional().nullable(),
      extra_info: z.string().trim().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type PropertyFormValues = z.infer<typeof PropertySchema>;
