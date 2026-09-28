import {
  BadgeCheck,
  CircleCheck,
  EyeOff,
  FilePenLine,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types/property";

const statusStyles: Record<
  PropertyStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  DRAFT: {
    label: "Draft",
    icon: FilePenLine,
    className: "text-amber-700 dark:text-amber-400",
  },
  PUBLISHED: {
    label: "Published",
    icon: CircleCheck,
    className: "text-emerald-700 dark:text-emerald-400",
  },
  SOLD: {
    label: "Sold",
    icon: BadgeCheck,
    className: "text-blue-700 dark:text-blue-400",
  },
  RENTED: {
    label: "Rented",
    icon: KeyRound,
    className: "text-violet-700 dark:text-violet-400",
  },
  HIDDEN: {
    label: "Hidden",
    icon: EyeOff,
    className: "text-slate-600 dark:text-slate-400",
  },
};

export function PropertyStatusBadge({
  status,
  className,
}: {
  status: PropertyStatus;
  className?: string;
}) {
  const { label, icon: Icon, className: color } = statusStyles[status];

  return (
    <Badge variant="outline" className={cn("h-auto gap-1.5 border-0 p-0 text-sm", color, className)}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}
