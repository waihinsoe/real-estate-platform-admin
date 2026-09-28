import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousPage}
        disabled={!canPreviousPage}
      >
        Previous
      </Button>

      <div className="rounded-md border bg-muted/50 px-3 py-1 text-sm">
        <span className="font-semibold text-primary">{pageIndex + 1}</span>
        <span className="text-muted-foreground"> of </span>
        <span>{pageCount}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={!canNextPage}
      >
        Next
      </Button>
    </div>
  );
}
