"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { TownshipType } from "@/types/township";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import { TownshipActionMenu } from "./township-action-menu";
import { PropertyCountCell } from "@/components/tanstack-table/cells/display/property-count-cell";

const helper = createColumnHelper<typeof dataTableFeatures, TownshipType>();

export const townshipColumns = helper.columns([
  helper.accessor("id", {
    header: ({ column }) => <SortableColumnHeader name="ID" column={column} />,
    cell: (info) => info.getValue(),
  }),
  helper.accessor("name_en", {
    header: ({ column }) => (
      <SortableColumnHeader name="English Name" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("name_mm", {
    header: ({ column }) => (
      <SortableColumnHeader name="Myanmar Name" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("region_id", {
    header: ({ column }) => (
      <SortableColumnHeader name="Region" column={column} />
    ),
    cell: ({ row }) => row.original.region.name_en,
  }),
  helper.accessor("_count", {
    header: "Properties",
    enableSorting: false,
    cell: ({ row, getValue }) => <PropertyCountCell count={getValue().properties} townshipId={row.original.id} />,
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TownshipActionMenu item={row.original} />,
  }),
]);
