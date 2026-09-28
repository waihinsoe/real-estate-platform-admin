"use client";

import type { ComponentProps } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

type AdminRoleSelectProps = Omit<
  ComponentProps<typeof NativeSelect>,
  "children" | "multiple"
>;

export function AdminRoleSelect({ className, ...props }: AdminRoleSelectProps) {
  return (
    <NativeSelect className={cn("w-full", className)} {...props}>
      <NativeSelectOption value="" disabled>
        Select a role
      </NativeSelectOption>
      <NativeSelectOption value="ADMIN">Admin</NativeSelectOption>
      <NativeSelectOption value="SUPER_ADMIN">Super admin</NativeSelectOption>
    </NativeSelect>
  );
}
