"use client";

import {
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";
import { dataTableFeatures, type DataTableColumnDef } from "./table-config";

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[] | undefined;
  isPending: boolean;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  pageCount: number;
  totalRowCount?: number;
  enableSortingRemoval?: boolean;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isPending,
  sorting,
  setSorting,
  pagination,
  setPagination,
  pageCount,
  totalRowCount = 0,
  enableSortingRemoval = true,
}: DataTableProps<TData>) {
  const tableData = useMemo(() => data ?? [], [data]);

  const table = useTable({
    data: tableData,
    columns,
    features: dataTableFeatures,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    enableSortingRemoval,
    manualPagination: true,
    pageCount,
  });

  return (
    <div>
      <div className="flex w-full items-center justify-between px-2">
        <div
          className={cn(
            "text-sm font-medium text-gray-500 dark:text-gray-400",
            isPending && "invisible",
          )}
          aria-hidden={isPending}
        >
          Results:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalRowCount}
          </span>{" "}
          total rows
        </div>

        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageCount={pageCount || 1}
          canNextPage={table.getCanNextPage()}
          canPreviousPage={table.getCanPreviousPage()}
          onNextPage={() => table.nextPage()}
          onPreviousPage={() => table.previousPage()}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              /* Show loading indicator when the data fetch is active */
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                  className="h-80 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              /* Render rows when pending state finishes and data exists */
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              /* Show empty fallback state when no data matches the queries */
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Table Footer - Pagination */}
      <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageCount={pageCount || 1}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        onNextPage={() => table.nextPage()}
        onPreviousPage={() => table.previousPage()}
      />
    </div>
  );
}
