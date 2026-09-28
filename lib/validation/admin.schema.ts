import { z } from "zod";

export const CreateAdminSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    is_active: z.boolean(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type CreateAdminFormValues = z.infer<typeof CreateAdminSchema>;

export const EditAdminSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
    email: z.email("Invalid email address").optional(),
    is_active: z.boolean().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", ""]).optional(),
  })
  .refine(
    (data) => {
      // If a password is typed, it must meet the length requirement
      if (data.password && data.password.length < 8) return false;
      return true;
    },
    {
      message: "Password must be at least 8 characters long",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      // If a password is typed, confirmation becomes strictly mandatory
      if (data.password && !data.password_confirmation) return false;
      return true;
    },
    {
      message: "Confirm password is required when setting a new password",
      path: ["password_confirmation"],
    },
  )
  .refine(
    (data) => {
      // If a password is typed, ensure it matches the confirmation field precisely
      if (data.password) return data.password === data.password_confirmation;
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    },
  );

export type EditAdminFormValues = z.infer<typeof EditAdminSchema>;
