"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { Amenity } from "@/types/amenity";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import { AmenityActionMenu } from "./amenity-action-menu";

const helper = createColumnHelper<typeof dataTableFeatures, Amenity>();

export const amenityColumns = helper.columns([
  helper.accessor("id", {
    header: ({ column }) => <SortableColumnHeader name="ID" column={column} />,
    cell: (info) => info.getValue(),
  }),
  helper.accessor("name", {
    header: ({ column }) => (
      <SortableColumnHeader name="Name" column={column} />
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AmenityActionMenu item={row.original} />,
  }),
]);
