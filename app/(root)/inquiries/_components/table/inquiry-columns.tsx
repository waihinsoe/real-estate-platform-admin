"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import type { Inquiry } from "@/types/inquiry";
import { InquiryActionMenu } from "./inquiry-action-menu";

const helper = createColumnHelper<typeof dataTableFeatures, Inquiry>();
export const inquiryColumns = helper.columns([
  helper.accessor("id", {
    header: ({ column }) => <SortableColumnHeader name="ID" column={column} />,
    cell: (info) => info.getValue(),
  }),
  helper.accessor("name", {
    header: ({ column }) => (
      <SortableColumnHeader name="Name" column={column} />
    ),
    cell: (info) => info.getValue() ?? "—",
  }),
  helper.accessor("phone", {
    header: ({ column }) => (
      <SortableColumnHeader name="Phone" column={column} />
    ),
    cell: (info) => info.getValue() ?? "—",
  }),
  helper.accessor("status", {
    header: ({ column }) => (
      <SortableColumnHeader name="Status" column={column} />
    ),
    cell: (info) => info.getValue()?.replaceAll("_", " "),
  }),
  helper.accessor("inquiry_type", {
    header: ({ column }) => (
      <SortableColumnHeader name="Type" column={column} />
    ),
    cell: (info) => info.getValue()?.replaceAll("_", " "),
  }),
  helper.accessor("source", {
    header: ({ column }) => (
      <SortableColumnHeader name="Source" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("property_id", {
    header: ({ column }) => (
      <SortableColumnHeader name="Property" column={column} />
    ),
    cell: ({ row }) => {
      const title = row.original.property?.title;
      return (
        <span className="block max-w-64 truncate" title={title}>
          {title ?? "—"}
        </span>
      );
    },
  }),
  helper.accessor("assigned_to_admin_id", {
    header: ({ column }) => (
      <SortableColumnHeader name="Assigned admin" column={column} />
    ),
    cell: ({ row }) => row.original.assigned_to_admin?.name ?? "Unassigned",
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InquiryActionMenu item={row.original} />,
  }),
]);
