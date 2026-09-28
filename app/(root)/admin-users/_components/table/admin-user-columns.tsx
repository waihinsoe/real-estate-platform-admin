"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { AdminUserType } from "@/types/admin-user";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import { AdminRoleUpdateSelect } from "@/components/tanstack-table/cells/select/admin-role-update-select";
import { AdminActionMenu } from "./admin-action-menu";
import { AdminStatusUpdateToggle } from "@/components/tanstack-table/cells/select/admin-status-update-toggle";

const helper = createColumnHelper<typeof dataTableFeatures, AdminUserType>();

export const adminUserColumns = helper.columns([
  helper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("name", {
    header: ({ column }) => (
      <SortableColumnHeader name="Name" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("email", {
    header: ({ column }) => (
      <SortableColumnHeader name="Email" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("role", {
    header: ({ column }) => (
      <SortableColumnHeader name="Role" column={column} />
    ),
    cell: ({ row }) => <AdminRoleUpdateSelect admin={row.original} />,
  }),
  helper.accessor("is_active", {
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <AdminStatusUpdateToggle admin={row.original} />,
  }),
  helper.accessor("created_at", {
    header: ({ column }) => (
      <SortableColumnHeader name="Created At" column={column} />
    ),
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AdminActionMenu item={row.original} />,
  }),
]);
