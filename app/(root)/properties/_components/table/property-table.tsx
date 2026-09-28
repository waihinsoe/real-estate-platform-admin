"use client";

import {
  SearchParamsTable,
  type SearchParamsTableQuery,
} from "@/components/tanstack-table/search-params-table";
import { useProperties } from "@/hooks/use-properties";
import type {
  PropertySortableField,
  PropertyType,
  PropertyStatus,
  ListingType,
} from "@/types/property";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import { propertyColumns } from "./property-columns";

type PropertyTableQuery = SearchParamsTableQuery<PropertySortableField> & {
  search: string;
  region_id: string | null;
  township_id: string | null;
  listing_type: ListingType | null;
  property_type: PropertyType | null;
  status: PropertyStatus | null;
  is_featured: boolean | null;
};

type PropertyTableProps = {
  query: PropertyTableQuery;
  setQuery: (update: {
    [Key in keyof PropertyTableQuery]?: PropertyTableQuery[Key] | null;
  }) => Promise<URLSearchParams>;
};

export function PropertyTable({ query, setQuery }: PropertyTableProps) {
  const { data, isPending, error, refetch } = useProperties({
    page: Math.max(0, query.pageIndex) + 1,
    limit: query.pageSize,
    search: query.search,
    region_id: query.region_id ? Number(query.region_id) : undefined,
    township_id: query.township_id ? Number(query.township_id) : undefined,
    listing_type: query.listing_type ?? undefined,
    property_type: query.property_type ?? undefined,
    status: query.status ?? undefined,
    is_featured: query.is_featured ?? undefined,
    sort_by: query.sort_by,
    sort_direction: query.sort_direction,
  });

  const totalRows = data?.meta?.total ?? 0;
  const pageCount = Math.ceil(totalRows / query.pageSize);

  if (error) {
    return (
      <div role="alert" className="space-y-2 text-destructive">
        <p>{formatErrorMessage(error)}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <SearchParamsTable
      columns={propertyColumns}
      data={data?.data}
      isPending={isPending}
      query={query}
      setQuery={setQuery}
      pageCount={pageCount}
      totalRowCount={totalRows}
    />
  );
}
