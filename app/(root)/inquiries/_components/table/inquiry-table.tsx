"use client";

import { SearchParamsTable, type SearchParamsTableQuery } from "@/components/tanstack-table/search-params-table";
import { useInquiries } from "@/hooks/use-inquiry";
import type { InquiryStatus, InquiryType, InquirySource, InquirySortBy } from "@/types/inquiry";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import { inquiryColumns } from "./inquiry-columns";

export type InquiryTableQuery = SearchParamsTableQuery<InquirySortBy> & {
  search: string;
  status: InquiryStatus | null;
  inquiry_type: InquiryType | null;
  source: InquirySource | null;
  property_id: string | null;
  assigned_to_admin_id: string | null;
  include_activities: boolean | null;
};

type InquiryTableProps = {
  query: InquiryTableQuery;
  setQuery: (update: { [Key in keyof InquiryTableQuery]?: InquiryTableQuery[Key] | null }) => Promise<URLSearchParams>;
};

const positiveId = (value: string | null) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};

export function InquiryTable({ query, setQuery }: InquiryTableProps) {
  const pageSize = Math.max(1, query.pageSize);
  const { data, isPending, error, refetch } = useInquiries({
    page: Math.max(0, query.pageIndex) + 1,
    limit: pageSize,
    search: query.search,
    status: query.status ?? undefined,
    inquiry_type: query.inquiry_type ?? undefined,
    source: query.source ?? undefined,
    property_id: positiveId(query.property_id),
    assigned_to_admin_id: positiveId(query.assigned_to_admin_id),
    include_activities: query.include_activities ?? undefined,
    sort_by: query.sort_by,
    sort_direction: query.sort_direction,
  });
  const totalRows = data?.meta?.total ?? 0;
  if (error) return (
    <div role="alert" className="space-y-2 text-destructive">
      <p>{formatErrorMessage(error)}</p>
      <Button variant="outline" onClick={() => void refetch()}>Retry</Button>
    </div>
  );
  return <SearchParamsTable columns={inquiryColumns} data={data?.data} isPending={isPending}
    query={{ ...query, pageSize }} setQuery={setQuery} pageCount={Math.ceil(totalRows / pageSize)} totalRowCount={totalRows} />;
}
