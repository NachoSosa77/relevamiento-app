// /app/api/dashboard/establecimientos-por-nivel-y-conservacion/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_CONSERV = new Set(["Bueno", "Regular", "Malo"]);

export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const localidad = (url.searchParams.get("localidad") || "").trim();
    const nivel = (url.searchParams.get("nivel") || "").trim();
    const conservacion = (url.searchParams.get("conservacion") || "").trim();
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

    if (!nivel) {
      return NextResponse.json({ message: "nivel requerido" }, { status: 400 });
    }
    if (!conservacion) {
      return NextResponse.json(
        { message: "conservacion requerida" },
        { status: 400 }
      );
    }
    if (!ALLOWED_CONSERV.has(conservacion)) {
      return NextResponse.json(
        { message: "conservacion inválida" },
        { status: 400 }
      );
    }

    const params: any[] = [];

    const sql = `
      WITH inst AS (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad,
          COALESCE(SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1), 'SIN NIVEL') AS modalidad_nivel,
          GROUP_CONCAT(DISTINCT i.cue ORDER BY i.cue SEPARATOR ',') AS cues,
          GROUP_CONCAT(DISTINCT i.institucion ORDER BY i.institucion SEPARATOR ' | ') AS instituciones,
          COUNT(DISTINCT i.id) AS instituciones_count
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      )
      SELECT
        r.id AS relevamiento_id,
        r.cui_id AS cui,
        inst.localidad,
        inst.modalidad_nivel,
        inst.cues,
        inst.instituciones,
        inst.instituciones_count,
        s.clasificacion AS conservacion,

        -- NUEVO: una construcción de ese relevamiento en ese estado
        MIN(s.construccion_id) AS construccion_id,

        COUNT(DISTINCT s.construccion_id) AS construcciones
      FROM relevamientos r
      JOIN inst ON inst.cui = r.cui_id
      JOIN estado_construccion_snapshot s ON s.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
        AND inst.modalidad_nivel = ?
        AND s.clasificacion = ?
      GROUP BY
        r.id, r.cui_id, inst.localidad, inst.modalidad_nivel,
        inst.cues, inst.instituciones, inst.instituciones_count,
        s.clasificacion
      ORDER BY
        construcciones DESC, r.id DESC
      LIMIT ? OFFSET ?;
    `;

    if (localidad) params.push(localidad);
    params.push(nivel);
    params.push(conservacion);
    params.push(limit, offset);

    const [rows]: any[] = await pool.query(sql, params);

    return NextResponse.json(
      {
        items: rows || [],
        paging: { limit, offset, count: (rows || []).length },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/establecimientos-por-nivel-y-conservacion:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
