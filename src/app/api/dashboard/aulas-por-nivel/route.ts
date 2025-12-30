/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/aulas-por-nivel?localidad=<opcional>&cui=<opcional>&cue=<opcional>
 * - Provincia fija: "La Pampa"
 * - relevamientos 'completo'
 * - Desduplicación de instituciones por CUI (predio)
 * - Cuenta aulas con COUNT(DISTINCT lpc.id)
 * - Considera aula solo si opciones_locales.name IN (...)
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

    if (cuiRaw != null && cui === null)
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });
    if (cui !== null && (!Number.isFinite(cui) || cui <= 0))
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });

    if (cueRaw != null && cue === null)
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });
    if (cue !== null && (!Number.isFinite(cue) || cue <= 0))
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });

    /**
     * Nota conceptual:
     * - Este KPI está modelado a nivel de CUI (predio): se cuelga del relevamiento y construcciones.
     * - Por eso, filtrar por CUE normalmente NO cambia aulas si ese CUE pertenece al mismo CUI,
     *   pero lo aplicamos para consistencia del dashboard y para acotar el universo cuando haga falta.
     */

    const sql = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        COUNT(DISTINCT lpc.id) AS aulas
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
      ) inst                           ON inst.cui = r.cui_id
      JOIN construcciones c            ON c.relevamiento_id = r.id
      JOIN locales_por_construccion lpc
           ON lpc.construccion_id = c.id
          AND lpc.relevamiento_id = r.id
      JOIN opciones_locales ol         ON ol.id = lpc.local_id
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
        ${cui !== null ? "AND r.cui_id = ?" : ""}
        AND ol.name IN (
          'Aula común',
          'Sala de nivel inicial',
          'Aula especial'
        )
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;

    const params: any[] = [];
    if (cui !== null) params.push(cui); // i.cui
    if (cue !== null) params.push(cue); // i.cue
    if (localidad) params.push(localidad);
    if (cui !== null) params.push(cui); // r.cui_id

    const [rows]: any[] = await pool.query(sql, params);
    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/aulas-por-nivel:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
