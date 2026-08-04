"use client";

import { createContext, useContext, useMemo } from "react";

import type { Permission } from "@/lib/auth/permissions";

const PermissionsContext = createContext<Set<Permission> | null>(null);

export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => new Set(permissions), [permissions]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/** The signed-in user's full permission set, for filtering lists. */
export function usePermissions(): Set<Permission> {
  const permissions = useContext(PermissionsContext);

  if (!permissions) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }

  return permissions;
}

/**
 * Whether the signed-in user holds a permission.
 *
 * For hiding controls only — the server action is what actually enforces it.
 */
export function useCan(permission: Permission): boolean {
  return usePermissions().has(permission);
}
