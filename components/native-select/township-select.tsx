"use client";

import type { ComponentProps } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useTownships } from "@/hooks/use-townships";
import { cn } from "@/lib/utils";

type TownshipSelectProps = Omit<
  ComponentProps<typeof NativeSelect>,
  "children" | "multiple"
> & { regionId?: number; allLabel?: string };

export function TownshipSelect({
  regionId,
  className,
  disabled,
  allLabel,
  ...props
}: TownshipSelectProps) {
  const canFetch = !!regionId || !!allLabel;
  const { data, isPending, isError, refetch } = useTownships(
    { region_id: regionId, page: 1, limit: 100 },
    canFetch,
  );
  const townships =
    data?.data.filter((township) => !regionId || township.region_id === regionId) ?? [];
  return (
    <div className="min-w-0 space-y-1">
      <NativeSelect
        {...props}
        className={cn("w-full", className)}
        disabled={disabled || !canFetch || isPending || isError}
      >
        <NativeSelectOption value="0" disabled={!allLabel}>
          {!canFetch
            ? "Select region first"
            : isPending
              ? "Loading townships..."
              : isError
                ? "Townships unavailable"
                : !townships.length
                  ? "No townships available"
                  : (allLabel ?? "Select township")}
        </NativeSelectOption>
        {townships.map((township) => (
          <NativeSelectOption key={township.id} value={township.id}>
            {township.name_en}
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
          Retry townships
        </button>
      )}
    </div>
  );
}
