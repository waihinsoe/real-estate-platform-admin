"use client";

import {
  functionalUpdate,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { DataTable } from "./data-table";
import type { DataTableColumnDef } from "./table-config";

type SortDirection = "asc" | "desc";

export interface SearchParamsTableQuery<TSortBy extends string> {
  pageIndex: number;
  pageSize: number;
  sort_by: TSortBy;
  sort_direction: SortDirection;
}

type SearchParamsTableQueryUpdate<TSortBy extends string> = Partial<{
  pageIndex: number | null;
  pageSize: number | null;
  sort_by: TSortBy | null;
  sort_direction: SortDirection | null;
}>;

interface SearchParamsTableProps<
  TData extends RowData,
  TSortBy extends string,
> {
  columns: DataTableColumnDef<TData>[];
  data: TData[] | undefined;
  isPending: boolean;
  query: SearchParamsTableQuery<TSortBy>;
  setQuery: (
    update: SearchParamsTableQueryUpdate<NoInfer<TSortBy>>,
  ) => Promise<URLSearchParams>;
  pageCount: number;
  totalRowCount?: number;
}

export function SearchParamsTable<
  TData extends RowData,
  TSortBy extends string,
>({
  columns,
  data,
  isPending,
  query,
  setQuery,
  pageCount,
  totalRowCount = 0,
}: SearchParamsTableProps<TData, TSortBy>) {
  const sorting: SortingState = [
    {
      id: query.sort_by,
      desc: query.sort_direction === "desc",
    },
  ];

  const setSorting: OnChangeFn<SortingState> = (updater) => {
    const nextSorting = functionalUpdate(updater, sorting);
    const nextSort = nextSorting[0] ?? sorting[0];

    void setQuery({
      pageIndex: 0,
      sort_by: nextSort.id as TSortBy,
      sort_direction: nextSort.desc ? "desc" : "asc",
    });
  };

  const normalizedPageCount = Math.max(1, pageCount);
  const pagination: PaginationState = {
    pageIndex: Math.min(Math.max(0, query.pageIndex), normalizedPageCount - 1),
    pageSize: query.pageSize,
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const nextPagination = functionalUpdate(updater, pagination);

    void setQuery({
      pageIndex: nextPagination.pageIndex,
      ...(nextPagination.pageSize !== query.pageSize
        ? { pageSize: nextPagination.pageSize }
        : {}),
    });
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      isPending={isPending}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      pageCount={normalizedPageCount}
      totalRowCount={totalRowCount}
      enableSortingRemoval={false}
    />
  );
}
