import { z } from "zod";

export const RegionSchema = z.object({
  name_en: z.string().trim().min(1, "English name is required"),
  name_mm: z.string().trim().min(1, "Myanmar name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
});

export type RegionFormValues = z.infer<typeof RegionSchema>;
