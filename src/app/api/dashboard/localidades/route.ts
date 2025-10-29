/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** GET /api/dashboard/localidades
 *  - Devuelve lista de localidades (La Pampa) para el selector
 *  - Solo ADMIN
 */
export async function GET(_req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    const [adminRows]: any[] = await pool.query(
      `SELECT 1
       FROM user_role ur
       JOIN role r ON r.id = ur.role_id AND r.is_active = 1
       WHERE ur.user_id = ? AND r.name = 'ADMIN'
       LIMIT 1`,
      [userId]
    );
    if (!Array.isArray(adminRows) || adminRows.length === 0) {
      return NextResponse.json({ message: "Sin permiso" }, { status: 403 });
    }

    const [rows]: any[] = await pool.query(
      `SELECT DISTINCT i.localidad
       FROM instituciones i
       WHERE UPPER(i.provincia) = 'LA PAMPA'
         AND i.localidad IS NOT NULL
       ORDER BY i.localidad`
    );

    const items = rows.map((r: any) => r.localidad);
    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/localidades:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
