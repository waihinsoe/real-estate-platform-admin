"use client";

import type { ComponentProps } from "react";
import { PropertyStatusBadge } from "@/components/badge/property-status-badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertySchema } from "@/lib/validation/property.schema";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types/property";

type PropertyStatusSelectProps = Omit<
  ComponentProps<typeof SelectTrigger>,
  "children" | "value" | "defaultValue" | "onChange" | "name"
> & {
  value: PropertyStatus;
  onValueChange: (status: PropertyStatus) => void;
  name?: string;
};

export function PropertyStatusSelect({
  value,
  onValueChange,
  name,
  disabled,
  className,
  ...triggerProps
}: PropertyStatusSelectProps) {
  return (
    <Select<PropertyStatus>
      name={name}
      value={value}
      disabled={disabled}
      onValueChange={(status) => {
        if (status !== null) onValueChange(status);
      }}
    >
      <SelectTrigger {...triggerProps} className={cn("w-full", className)}>
        <SelectValue>
          <PropertyStatusBadge status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {PropertySchema.shape.status.options.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
