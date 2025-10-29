/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/edificios-por-nivel?localidad=<opcional>
 * - Provincia fija: "La Pampa"
 * - Solo relevamientos con estado = "completo"
 * - Desduplicación por CUI en instituciones para evitar sobreconteo
 * - Solo ADMIN
 */
export async function GET(req: NextRequest) {
  try {
    // Auth
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    // Guard: ADMIN
    const [adminRows]: any[] = await pool.query(
      `
      SELECT 1
      FROM user_role ur
      JOIN role r ON r.id = ur.role_id AND r.is_active = 1
      WHERE ur.user_id = ? AND r.name = 'ADMIN'
      LIMIT 1
      `,
      [userId]
    );
    if (!Array.isArray(adminRows) || adminRows.length === 0) {
      return NextResponse.json({ message: "Sin permiso" }, { status: 403 });
    }

    // Params
    const url = new URL(req.url);
    const localidad = url.searchParams.get("localidad");

    // Query con instituciones desduplicadas por CUI
    const sql = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        COUNT(DISTINCT c.id) AS edificios
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.provincia ORDER BY i.id), ',', 1)       AS provincia,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1)       AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE UPPER(i.provincia) = 'LA PAMPA'
        GROUP BY i.cui
      ) inst                         ON inst.cui = r.cui_id
      JOIN construcciones c          ON c.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;

    const params: any[] = [];
    if (localidad && localidad.trim() !== "") params.push(localidad.trim());

    const [rows]: any[] = await pool.query(sql, params);

    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/edificios-por-nivel:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
