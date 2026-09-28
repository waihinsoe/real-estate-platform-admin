import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type QueryState = {
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => unknown;
};

export function QueryContent({
  query,
  children,
}: {
  query: QueryState;
  children: ReactNode;
}) {
  if (query.isPending) {
    return (
      <div role="status" className="space-y-3 py-2">
        <span className="sr-only">Loading dashboard data</span>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div role="alert" className="flex flex-wrap items-center gap-2 py-2">
        <span className="text-sm text-destructive">Unable to load data.</span>
        <Button
          variant="outline"
          size="sm"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          {query.isFetching ? "Retrying…" : "Retry"}
        </Button>
      </div>
    );
  }

  return children;
}

export function SummaryCard({
  title,
  description,
  href,
  icon: Icon,
  query,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  query: QueryState & { data?: { meta: { total: number } } };
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-medium text-muted-foreground">{title}</h2>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
        <QueryContent query={query}>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {query.data?.meta.total.toLocaleString("en-US")}
          </p>
        </QueryContent>
        <Link
          href={href}
          className="flex items-center justify-between gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          {description}
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
  );
}
