"use client";

import type { ComponentProps } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

export function ListingTypeSelect({
  className,
  ...props
}: Omit<ComponentProps<typeof NativeSelect>, "children" | "multiple">) {
  return (
    <NativeSelect {...props} className={cn("w-full", className)}>
      <NativeSelectOption value="SALE">Sale</NativeSelectOption>
      <NativeSelectOption value="RENT">Rent</NativeSelectOption>
    </NativeSelect>
  );
}
