import { z } from "zod";

export const AmenitySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type AmenityFormValues = z.infer<typeof AmenitySchema>;
