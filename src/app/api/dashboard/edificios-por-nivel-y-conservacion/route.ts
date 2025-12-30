// /api/dashboard/edificios-por-nivel-y-conservacion/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/edificios-por-nivel-y-conservacion?localidad=<opcional>&cui=<opcional>&cue=<opcional>
 * - Provincia fija: "La Pampa"
 * - Solo relevamientos con estado = "completo"
 * - Cantidad de CONSTRUCCIONES agrupadas por Nivel Educativo y Estado de Conservación (snapshot)
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

    if (cuiRaw != null && cui === null)
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });
    if (cui !== null && (!Number.isFinite(cui) || cui <= 0))
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });

    if (cueRaw != null && cue === null)
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });
    if (cue !== null && (!Number.isFinite(cue) || cue <= 0))
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });

    const params: any[] = [];

    /**
     * Nota de diseño:
     * - inst desdup por CUI para resolver localidad/nivel consistente con el resto del dashboard.
     * - filtro por CUE se aplica con EXISTS contra instituciones_por_relevamiento, para no
     *   “romper” la desduplicación por CUI.
     * - se filtra r.estado='completo' y además se une a r por seguridad.
     */
    const sql = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        s.clasificacion AS conservacion,
        COUNT(DISTINCT s.construccion_id) AS construcciones
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
        GROUP BY i.cui
      ) inst ON inst.cui = r.cui_id
      JOIN estado_construccion_snapshot s
        ON s.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
        ${cui !== null ? "AND r.cui_id = ?" : ""}
        ${
          cue !== null
            ? `AND EXISTS (
                 SELECT 1
                 FROM instituciones_por_relevamiento ipr
                 JOIN instituciones i2 ON i2.id = ipr.institucion_id
                 WHERE ipr.relevamiento_id = r.id
                   AND i2.cue = ?
               )`
            : ""
        }
      GROUP BY
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL'),
        s.clasificacion
      ORDER BY
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL'),
        FIELD(s.clasificacion, 'Bueno', 'Regular', 'Malo');
    `;

    // params en el orden exacto de los placeholders
    if (cui !== null) params.push(cui); // i.cui
    if (localidad) params.push(localidad);
    if (cui !== null) params.push(cui); // r.cui_id
    if (cue !== null) params.push(cue); // EXISTS i2.cue

    const [rows]: any[] = await pool.query(sql, params);

    const total = (rows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    return NextResponse.json({ items: rows, total }, { status: 200 });
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/edificios-por-nivel-y-conservacion:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
