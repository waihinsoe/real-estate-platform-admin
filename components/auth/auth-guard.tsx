"use client";

import { useMe } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useMe();

  if (isLoading || isError) {
    return null;
  }

  return <>{children}</>;
}
