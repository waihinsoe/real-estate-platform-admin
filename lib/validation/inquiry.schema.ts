import { z } from "zod";
import { INQUIRY_STATUSES } from "@/types/inquiry";

export const InquirySchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
  assigned_to_admin_id: z.number().int().positive().optional(),
});
export type InquiryFormValues = z.infer<typeof InquirySchema>;

export const InquiryActivitySchema = z.object({
  note: z.string().trim().min(1, "Note is required"),
  next_follow_up_at: z
    .string()
    .refine(
      (value) => !value || !Number.isNaN(new Date(value).getTime()),
      "Enter a valid date and time",
    ),
});
export type InquiryActivityFormValues = z.infer<typeof InquiryActivitySchema>;
