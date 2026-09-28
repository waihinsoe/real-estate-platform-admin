import { cn } from "@/lib/utils";

type TruncateCellProps = {
  value?: string | null;
  className?: string;
};

export function TruncateCell({ value, className }: TruncateCellProps) {
  const text = value?.trim() || "--";

  return (
    <span title={text} className={cn("block max-w-62.5 truncate", className)}>
      {text}
    </span>
  );
}
