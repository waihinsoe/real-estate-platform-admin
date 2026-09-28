"use client";

import {
  SearchParamsTable,
  type SearchParamsTableQuery,
} from "@/components/tanstack-table/search-params-table";
import { useTownships } from "@/hooks/use-townships";
import type { TownshipSortableField } from "@/types/township";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import { townshipColumns } from "./township-columns";

type TownshipTableQuery = SearchParamsTableQuery<TownshipSortableField> & {
  search: string;
  region_id: string | null;
};

type TownshipTableProps = {
  query: TownshipTableQuery;
  setQuery: (update: {
    [Key in keyof TownshipTableQuery]?: TownshipTableQuery[Key] | null;
  }) => Promise<URLSearchParams>;
};

export function TownshipTable({ query, setQuery }: TownshipTableProps) {
  const { data, isPending, error, refetch } = useTownships({
    page: Math.max(0, query.pageIndex) + 1,
    limit: query.pageSize,
    search: query.search,
    region_id: query.region_id ? Number(query.region_id) : undefined,
    sort_by: query.sort_by,
    sort_direction: query.sort_direction,
  });

  const totalRows = data?.meta?.total ?? 0;
  const pageCount = Math.ceil(totalRows / query.pageSize);

  if (error) {
    return (
      <div role="alert" className="space-y-2 text-destructive">
        <p>{formatErrorMessage(error)}</p>
        <Button variant="outline" onClick={() => void refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <SearchParamsTable
      columns={townshipColumns}
      data={data?.data}
      isPending={isPending}
      query={query}
      setQuery={setQuery}
      pageCount={pageCount}
      totalRowCount={totalRows}
    />
  );
}
