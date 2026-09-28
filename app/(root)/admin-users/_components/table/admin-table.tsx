"use client";

import {
  SearchParamsTable,
  type SearchParamsTableQuery,
} from "@/components/tanstack-table/search-params-table";
import { useAdminUsers } from "@/hooks/use-admin-users";
import type { AdminRoleEnum, AdminSortableField } from "@/types/admin-user";
import { adminUserColumns } from "./admin-user-columns";

type AdminTableQuery = SearchParamsTableQuery<AdminSortableField> & {
  search: string;
  role: AdminRoleEnum | null;
  is_active: boolean | null;
};

type AdminTableProps = {
  query: AdminTableQuery;
  setQuery: (update: {
    [Key in keyof AdminTableQuery]?: AdminTableQuery[Key] | null;
  }) => Promise<URLSearchParams>;
};

export function AdminTable({ query, setQuery }: AdminTableProps) {
  const { data, isPending } = useAdminUsers({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    search: query.search,
    role: query.role ?? undefined,
    is_active: query.is_active ?? undefined,
    sort_by: query.sort_by,
    sort_direction: query.sort_direction,
  });

  const totalRows = data?.meta?.total ?? 0;
  const pageCount = Math.ceil(totalRows / query.pageSize);

  return (
    <SearchParamsTable
      columns={adminUserColumns}
      data={data?.data}
      isPending={isPending}
      query={query}
      setQuery={setQuery}
      pageCount={pageCount}
      totalRowCount={totalRows}
    />
  );
}
