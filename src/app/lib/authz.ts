import { pool } from "./db";

export async function userHasPermission(
  userId: number,
  code: string
): Promise<boolean> {
  if (process.env.RBAC_ENABLED !== "true") return true; // compat: no bloquear a nadie
  const rows = await pool.query<any[]>(
    `
    SELECT 1
    FROM user_role ur
    JOIN role_permission rp ON rp.role_id = ur.role_id
    JOIN permission p ON p.id = rp.permission_id
    WHERE ur.user_id = ? AND p.code = ?
    LIMIT 1
    `,
    [userId, code]
  );
  return rows.length > 0;
}
