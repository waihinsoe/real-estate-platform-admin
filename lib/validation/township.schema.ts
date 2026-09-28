import { z } from "zod";

export const TownshipSchema = z.object({
  name_en: z.string().trim().min(1, "English name is required"),
  name_mm: z.string().trim().min(1, "Myanmar name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  region_id: z.number().int().positive("Region ID must be a positive integer"),
});

export type TownshipFormValues = z.infer<typeof TownshipSchema>;
