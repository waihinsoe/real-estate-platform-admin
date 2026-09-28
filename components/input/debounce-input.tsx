"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface DebounceInputProps {
  value?: string;
  delay?: number;
  placeholder?: string;
  onDebouncedChange: (value: string) => void;
  className?: string;
}

export function DebounceInput({
  value = "",
  delay = 500,
  placeholder,
  onDebouncedChange,
  className,
}: DebounceInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the draft in sync when a parent explicitly resets the search value.
  // This effect intentionally mirrors a controlled value into a debounced draft.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue === value) return;

    timerRef.current = setTimeout(() => {
      onDebouncedChange(inputValue);
    }, delay);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [inputValue, value, delay, onDebouncedChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn("border w-full", inputValue && "pr-9")}
      />
      {inputValue.length > 0 && (
        <button
          type="button"
          aria-label="Clear input"
          title="Clear input"
          className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded text-red-500 hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-ring"
          onClick={() => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
            setInputValue("");
            onDebouncedChange("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
