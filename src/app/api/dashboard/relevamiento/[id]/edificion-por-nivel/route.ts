/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/relevamiento/[id]/edificios-por-nivel
 *
 * - Misma lógica que /api/dashboard/edificios-por-nivel,
 *   pero para UN solo relevamiento (r.id = :id)
 * - Provincia fija: "La Pampa"
 * - Solo relevamientos con estado = "completo"
 * - Solo ADMIN
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

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

    const { id } = await params;
    const relevamientoId = Number(id);
    if (!relevamientoId || Number.isNaN(relevamientoId)) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    // Versión por relevamiento:
    // - misma desduplicación de instituciones por CUI
    // - misma lógica de niveles
    // - pero filtrado a r.id = ?
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
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      ) inst                         ON inst.cui = r.cui_id
      JOIN construcciones c          ON c.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        AND r.id = ?
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;

    const [rows]: any[] = await pool.query(sql, [relevamientoId]);

    return NextResponse.json(
      {
        relevamientoId,
        items: rows,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/relevamiento/[id]/edificios-por-nivel:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
