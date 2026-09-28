"use client";

import type { ComponentProps } from "react";
import { Check } from "lucide-react";
import { useAmenities } from "@/hooks/use-amenities";
import { cn } from "@/lib/utils";

type AmenitySelectProps = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  value: number[];
  onChange: (ids: number[]) => void;
};

export function AmenitySelect({
  value,
  onChange,
  className,
  disabled,
  ...props
}: AmenitySelectProps) {
  const { data, isPending, isError, refetch } = useAmenities({
    page: 1,
    limit: 100,
  });
  const amenities = data?.data ?? [];

  return (
    <fieldset
      {...props}
      disabled={disabled}
      aria-label={props["aria-label"] ?? "Amenities"}
      aria-busy={isPending}
      tabIndex={-1}
      className={cn("min-w-0 space-y-2", className)}
    >
      {isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading amenities...
        </p>
      ) : isError ? (
        <div role="alert" className="space-y-1 text-sm text-destructive">
          <p>Amenities unavailable</p>
          <button
            type="button"
            disabled={disabled}
            className="underline"
            onClick={() => void refetch()}
          >
            Retry amenities
          </button>
        </div>
      ) : amenities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No amenities available.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => {
            const selected = value.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-500 dark:text-green-950 dark:hover:bg-green-400"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() =>
                  onChange(
                    selected
                      ? value.filter((id) => id !== amenity.id)
                      : [...value, amenity.id],
                  )
                }
              >
                {amenity.name}
                {selected && <Check className="size-3.5" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
