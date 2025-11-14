// /api/dashboard/establecimientos/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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

    // Params
    const url = new URL(req.url);
    const localidad = (url.searchParams.get("localidad") || "").trim();
    const q = (url.searchParams.get("q") || "").trim(); // texto libre (nombre o CUI)
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 200);

    const params: any[] = [];

    const sql = `
      SELECT
        t.cui,
        COALESCE(
          NULLIF(SUBSTRING_INDEX(GROUP_CONCAT(NULLIF(TRIM(t.institucion), '') ORDER BY t.institucion SEPARATOR ','), ',', 1), ''),
          CONCAT('CUI ', t.cui)
        ) AS etiqueta,
        SUBSTRING_INDEX(GROUP_CONCAT(t.localidad ORDER BY t.institucion SEPARATOR ','), ',', 1)       AS localidad,
        SUBSTRING_INDEX(GROUP_CONCAT(t.modalidad_nivel ORDER BY t.institucion SEPARATOR ','), ',', 1) AS modalidad_nivel
      FROM (
        SELECT i.cui, i.institucion, i.localidad, i.modalidad_nivel, i.provincia
        FROM relevamientos r
        JOIN instituciones_por_relevamiento ipr ON ipr.relevamiento_id = r.id
        JOIN instituciones i ON i.id = ipr.institucion_id
        WHERE r.estado = 'completo'

        UNION ALL

        SELECT i.cui, i.institucion, i.localidad, i.modalidad_nivel, i.provincia
        FROM construcciones c
        JOIN relevamientos r ON r.id = c.relevamiento_id
        JOIN instituciones_por_construccion ipc ON ipc.construccion_id = c.id
        JOIN instituciones i ON i.id = ipc.institucion_id
        WHERE r.estado = 'completo'
      ) t
      WHERE UPPER(t.provincia) = 'LA PAMPA'
        ${localidad ? "AND t.localidad = ?" : ""}
        ${
          q
            ? "AND ( (t.institucion IS NOT NULL AND t.institucion LIKE ?) OR CAST(t.cui AS CHAR) LIKE ? )"
            : ""
        }
      GROUP BY t.cui
      ORDER BY etiqueta ASC
      LIMIT ?
    `;

    if (localidad) params.push(localidad);
    if (q) {
      params.push(`%${q}%`, `%${q}%`); // busca por nombre y por CUI (texto)
    }
    params.push(limit);

    const [rows]: any[] = await pool.query(sql, params);
    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/establecimientos:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
