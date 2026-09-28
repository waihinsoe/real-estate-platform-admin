"use client";

import type { ComponentProps } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PropertySchema } from "@/lib/validation/property.schema";
import { cn } from "@/lib/utils";

export function PropertyTypeSelect({
  className,
  ...props
}: Omit<ComponentProps<typeof NativeSelect>, "children" | "multiple">) {
  return (
    <NativeSelect {...props} className={cn("w-full", className)}>
      {PropertySchema.shape.property_type.options.map((value) => (
        <NativeSelectOption key={value} value={value}>
          {value.charAt(0) + value.slice(1).toLowerCase()}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
