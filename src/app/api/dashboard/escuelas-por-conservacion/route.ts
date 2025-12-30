// /api/dashboard/escuelas-por-conservacion/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ESTADOS = new Set(["Bueno", "Regular", "Malo"]);

export async function GET(req: NextRequest) {
  try {
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

    const url = new URL(req.url);

    // Provincia: por defecto La Pampa (como tu dashboard actual)
    const provincia = (
      url.searchParams.get("provincia")?.trim() || "La Pampa"
    ).trim();

    const localidad = (url.searchParams.get("localidad")?.trim() || "").trim();

    const cuiRaw = url.searchParams.get("cui");
    const cueRaw = url.searchParams.get("cue");
    const estado = (url.searchParams.get("estado")?.trim() || "").trim();

    const cui = cuiRaw != null && cuiRaw !== "" ? Number(cuiRaw) : null;
    const cue = cueRaw != null && cueRaw !== "" ? Number(cueRaw) : null;

    if (cuiRaw != null && (!Number.isFinite(cui) || (cui as number) <= 0)) {
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });
    }
    if (cueRaw != null && (!Number.isFinite(cue) || (cue as number) <= 0)) {
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });
    }
    if (estado && !ESTADOS.has(estado)) {
      return NextResponse.json({ message: "estado inválido" }, { status: 400 });
    }

    // Institución deduplicada por CUI para provincia/localidad
    const instDedup = `
      SELECT
        i.cui,
        SUBSTRING_INDEX(GROUP_CONCAT(i.provincia  ORDER BY i.id), ',', 1) AS provincia,
        SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad
      FROM instituciones i
      GROUP BY i.cui
    `;

    // WHERE base: solo relevamientos completos + provincia
    const where: string[] = [];
    const params: any[] = [];

    where.push(`r.estado = 'completo'`);
    where.push(`UPPER(inst.provincia) = UPPER(?)`);
    params.push(provincia);

    if (localidad) {
      where.push(`inst.localidad = ?`);
      params.push(localidad);
    }

    if (cui != null) {
      where.push(`r.cui_id = ?`);
      params.push(cui);
    }

    // Filtro CUE: el relevamiento debe tener ese CUE asociado en la tabla puente
    if (cue != null) {
      where.push(`
        EXISTS (
          SELECT 1
          FROM instituciones_por_relevamiento ipr
          JOIN instituciones i ON i.id = ipr.institucion_id
          WHERE ipr.relevamiento_id = r.id
            AND i.cue = ?
        )
      `);
      params.push(cue);
    }

    // Detalle (para tu panel/listado)
    if (estado) {
      const sqlList = `
        SELECT
          s.clasificacion,
          s.score,
          s.relevamiento_id,
          s.construccion_id AS construccionId,
          c.numero_construccion
        FROM estado_construccion_snapshot s
        JOIN relevamientos r ON r.id = s.relevamiento_id
        JOIN (${instDedup}) inst ON inst.cui = r.cui_id
        JOIN construcciones c ON c.id = s.construccion_id
        WHERE ${where.join(" AND ")}
          AND s.clasificacion = ?
        ORDER BY r.id DESC, c.numero_construccion ASC, s.construccion_id ASC
        LIMIT 500
      `;

      const [rows]: any[] = await pool.query(sqlList, [...params, estado]);
      return NextResponse.json({ items: rows }, { status: 200 });
    }

    // Agregado (para gráfico)
    const sqlAgg = `
      SELECT
        s.clasificacion,
        COUNT(*) AS construcciones
      FROM estado_construccion_snapshot s
      JOIN relevamientos r ON r.id = s.relevamiento_id
      JOIN (${instDedup}) inst ON inst.cui = r.cui_id
      WHERE ${where.join(" AND ")}
      GROUP BY s.clasificacion
      ORDER BY FIELD(s.clasificacion,'Bueno','Regular','Malo')
    `;

    const [rows]: any[] = await pool.query(sqlAgg, params);

    const total = (rows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    return NextResponse.json({ items: rows, total }, { status: 200 });
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/escuelas-por-conservacion:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
