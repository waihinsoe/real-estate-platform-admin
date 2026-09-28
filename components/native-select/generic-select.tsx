"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

export type GenericSelectProps<T extends string> = {
  value: T | null;
  onValueChange: (value: T | null) => void;
  options: readonly { value: T; label: string }[];
  placeholder: string;
  label: string;
  disabled?: boolean;
  className?: string;
};

export function GenericSelect<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  disabled,
  className,
}: GenericSelectProps<T>) {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className={cn("relative min-w-0", className)}>
      <NativeSelect
        ref={selectRef}
        className={cn("w-full", value !== null && "[&_select]:pr-16")}
        value={value ?? ""}
        onChange={(event) => {
          const option = options.find((item) => item.value === event.target.value);
          onValueChange(option?.value ?? null);
        }}
        disabled={disabled}
        aria-label={label}
      >
        <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {value !== null && (
        <button
          type="button"
          aria-label={`Clear ${label.toLowerCase()}`}
          title={`Clear ${label.toLowerCase()}`}
          disabled={disabled}
          className="absolute top-1/2 right-7 flex size-7 -translate-y-1/2 items-center justify-center rounded text-red-500 hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            onValueChange(null);
            selectRef.current?.focus();
          }}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
