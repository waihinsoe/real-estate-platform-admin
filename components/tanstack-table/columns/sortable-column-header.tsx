"use client";

import type { Column, RowData } from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react";
import type { dataTableFeatures } from "../table-config";

interface Props {
  name: string;
  column: Pick<
    Column<typeof dataTableFeatures, RowData>,
    "getIsSorted" | "getToggleSortingHandler"
  >;
}

export function SortableColumnHeader({ name, column }: Props) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="flex cursor-pointer items-center gap-1.5"
    >
      <span className="inline-flex items-center -space-x-1.25">
        <MoveDown
          className={`size-2.5 ${
            sorted === "desc" ? "text-foreground" : "text-muted-foreground"
          }`}
        />

        <MoveUp
          className={`size-2.5 ${
            sorted === "asc" ? "text-foreground" : "text-muted-foreground"
          }`}
        />
      </span>

      {name}
    </button>
  );
}
