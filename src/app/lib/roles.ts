// app/lib/roles.ts
export type RoleName = "ADMIN" | "ANALISTA" | "SUPERVISOR";

export const hasRole = (user?: { roles?: RoleName[] }, role?: RoleName) =>
  !!user && !!user.roles?.includes(role!);
