import { CircleCheck, CircleMinus } from "lucide-react";

export function AdminStatusCell({ isActive }: { isActive: boolean }) {
  const Icon = isActive ? CircleCheck : CircleMinus;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
      <Icon aria-hidden="true" className="size-4" />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
