"use client";

import type { ComponentProps } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useRegions } from "@/hooks/use-regions";
import { cn } from "@/lib/utils";

export function RegionSelect({
  className,
  disabled,
  allLabel,
  ...props
}: Omit<ComponentProps<typeof NativeSelect>, "children" | "multiple"> & {
  allLabel?: string;
}) {
  const { data, isPending, isError, refetch } = useRegions({
    page: 1,
    limit: 100,
  });
  return (
    <div className="min-w-0 space-y-1">
      <NativeSelect
        {...props}
        className={cn("w-full", className)}
        disabled={disabled || isPending || isError}
      >
        <NativeSelectOption value="0" disabled={!allLabel}>
          {isPending
            ? "Loading regions..."
            : isError
              ? "Regions unavailable"
              : (allLabel ?? "Select region")}
        </NativeSelectOption>
        {data?.data.map((region) => (
          <NativeSelectOption key={region.id} value={region.id}>
            {region.name_en}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {isError && (
        <button
          type="button"
          disabled={disabled}
          className="text-sm text-destructive underline"
          onClick={() => void refetch()}
        >
          Retry regions
        </button>
      )}
    </div>
  );
}
