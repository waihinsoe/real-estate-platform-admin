"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { RegionType } from "@/types/region";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import { RegionActionMenu } from "./region-action-menu";
import { PropertyCountCell } from "@/components/tanstack-table/cells/display/property-count-cell";
import { TownshipCountCell } from "@/components/tanstack-table/cells/display/township-count-cell";

const helper = createColumnHelper<typeof dataTableFeatures, RegionType>();

export const regionColumns = helper.columns([
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
  helper.accessor("slug", {
    header: ({ column }) => (
      <SortableColumnHeader name="Slug" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.display({
    id: "township_count",
    header: "Townships",
    cell: ({ row }) => (
      <TownshipCountCell
        count={row.original._count.townships}
        regionId={row.original.id}
      />
    ),
  }),
  helper.display({
    id: "property_count",
    header: "Properties",
    cell: ({ row }) => (
      <PropertyCountCell
        count={row.original._count.properties}
        regionId={row.original.id}
      />
    ),
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RegionActionMenu item={row.original} />,
  }),
]);
