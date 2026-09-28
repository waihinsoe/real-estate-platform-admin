import { QueryType } from "./query-type";

export interface AdminUserType {
  id: number;
  name: string;
  email: string;
  role: AdminRoleEnum;
  is_active: boolean;
  created_at: string;
}

export type AdminRoleEnum = "SUPER_ADMIN" | "ADMIN";

export type AdminSortableField = "id" | "name" | "email" | "role" | "created_at";

export interface AdminQueryType extends QueryType<AdminSortableField> {
  is_active?: boolean;
  role?: AdminRoleEnum;
}
