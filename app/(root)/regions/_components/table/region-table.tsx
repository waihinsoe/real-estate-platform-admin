"use client";

import {
  SearchParamsTable,
  type SearchParamsTableQuery,
} from "@/components/tanstack-table/search-params-table";
import { useRegions } from "@/hooks/use-regions";
import type { RegionSortableField } from "@/types/region";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import { regionColumns } from "./region-columns";

type RegionTableQuery = SearchParamsTableQuery<RegionSortableField> & {
  search: string;
};

type RegionTableProps = {
  query: RegionTableQuery;
  setQuery: (update: {
    [Key in keyof RegionTableQuery]?: RegionTableQuery[Key] | null;
  }) => Promise<URLSearchParams>;
};

export function RegionTable({ query, setQuery }: RegionTableProps) {
  const { data, isPending, error, refetch } = useRegions({
    page: Math.max(0, query.pageIndex) + 1,
    limit: query.pageSize,
    search: query.search,
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
      columns={regionColumns}
      data={data?.data}
      isPending={isPending}
      query={query}
      setQuery={setQuery}
      pageCount={pageCount}
      totalRowCount={totalRows}
    />
  );
}
