"use client";

import {
  SearchParamsTable,
  type SearchParamsTableQuery,
} from "@/components/tanstack-table/search-params-table";
import { useAmenities } from "@/hooks/use-amenities";
import type { AmenitySortableField } from "@/types/amenity";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import { amenityColumns } from "./amenity-columns";

type AmenityTableQuery = SearchParamsTableQuery<AmenitySortableField> & {
  search: string;
};

type AmenityTableProps = {
  query: AmenityTableQuery;
  setQuery: (update: {
    [Key in keyof AmenityTableQuery]?: AmenityTableQuery[Key] | null;
  }) => Promise<URLSearchParams>;
};

export function AmenityTable({ query, setQuery }: AmenityTableProps) {
  const { data, isPending, error, refetch } = useAmenities({
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
      columns={amenityColumns}
      data={data?.data}
      isPending={isPending}
      query={query}
      setQuery={setQuery}
      pageCount={pageCount}
      totalRowCount={totalRows}
    />
  );
}
