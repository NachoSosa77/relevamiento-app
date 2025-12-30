/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/metros2-por-nivel?localidad=<opcional>&cui=<opcional>&cue=<opcional>
 * - Provincia fija: "La Pampa"
 * - Solo relevamientos con estado = "completo"
 * - Deduplicación de instituciones por CUI (para evitar sobreconteo)
 * - m² desde locales_por_construccion.superficie (más granular y consistente con aulas)
 * - Filtros opcionales: localidad, CUI, CUE
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
    const localidad = url.searchParams.get("localidad")?.trim() || "";
    const cuiRaw = url.searchParams.get("cui");
    const cueRaw = url.searchParams.get("cue");

    const cui = cuiRaw != null && cuiRaw !== "" ? Number(cuiRaw) : null;
    const cue = cueRaw != null && cueRaw !== "" ? Number(cueRaw) : null;

    if (cuiRaw != null && (cui === null || !Number.isFinite(cui) || cui <= 0)) {
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });
    }
    if (cueRaw != null && (cue === null || !Number.isFinite(cue) || cue <= 0)) {
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });
    }

    /**
     * Importante:
     * - Instancias deduplicadas por CUI
     * - Si viene CUE, se filtra dentro del subquery ANTES del GROUP BY i.cui
     *   (porque un CUI puede tener varios CUEs y si deduplicás primero podrías perder el filtro).
     */
    const sql = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        ROUND(SUM(COALESCE(lpc.superficie, 0)), 2) AS m2
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.provincia ORDER BY i.id), ',', 1)       AS provincia,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1)       AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
          ${cui !== null ? "AND i.cui = ?" : ""}
          ${cue !== null ? "AND i.cue = ?" : ""}
        GROUP BY i.cui
      ) inst                          ON inst.cui = r.cui_id
      JOIN construcciones c           ON c.relevamiento_id = r.id
      JOIN locales_por_construccion lpc ON lpc.construccion_id = c.id
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
        ${cui !== null ? "AND r.cui_id = ?" : ""}
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;

    const params: any[] = [];
    if (cui !== null) params.push(cui); // i.cui
    if (cue !== null) params.push(cue); // i.cue
    if (localidad) params.push(localidad); // inst.localidad
    if (cui !== null) params.push(cui); // r.cui_id

    const [rows]: any[] = await pool.query(sql, params);
    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/metros2-por-nivel:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
