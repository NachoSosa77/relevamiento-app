/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/resumen-relevado
 *
 * Params opcionales:
 * - localidad
 * - cui
 * - cue
 *
 * Lógica:
 * - Solo relevamientos con estado = "completo"
 * - CUIs / CUEs efectivamente relevados (instituciones_por_relevamiento)
 * - Filtros consistentes con todo el dashboard
 * - Solo ADMIN
 */
export async function GET(req: NextRequest) {
  try {
    /* =========================
       Auth
    ========================= */
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    /* =========================
       Guard: ADMIN
    ========================= */
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

    /* =========================
       Params
    ========================= */
    const url = new URL(req.url);

    const localidad = url.searchParams.get("localidad")?.trim() || null;

    const cuiRaw = url.searchParams.get("cui");
    const cueRaw = url.searchParams.get("cue");

    const cui = cuiRaw && cuiRaw !== "" ? Number(cuiRaw) : null;
    const cue = cueRaw && cueRaw !== "" ? Number(cueRaw) : null;

    if (cuiRaw && (!Number.isFinite(cui) || (cui as number) <= 0)) {
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });
    }

    if (cueRaw && (!Number.isFinite(cue) || (cue as number) <= 0)) {
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });
    }

    /* =========================
       WHERE dinámico (compartido)
    ========================= */
    const where: string[] = [];
    const params: any[] = [];

    if (localidad) {
      where.push("i.localidad = ?");
      params.push(localidad);
    }

    if (cui != null) {
      where.push("i.cui = ?");
      params.push(cui);
    }

    if (cue != null) {
      where.push("i.cue = ?");
      params.push(cue);
    }

    const whereSql = where.length ? "AND " + where.join(" AND ") : "";

    /* =========================
       1) Predios (CUIs)
    ========================= */
    const sqlCuis = `
      SELECT COUNT(DISTINCT i.cui) AS cuis
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr
        ON ipr.relevamiento_id = r.id
      JOIN instituciones i
        ON i.id = ipr.institucion_id
      WHERE r.estado = 'completo'
        AND i.cui IS NOT NULL
        ${whereSql}
    `;

    /* =========================
       2) Establecimientos (CUEs)
    ========================= */
    const sqlCues = `
      SELECT COUNT(DISTINCT i.cue) AS cues
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr
        ON ipr.relevamiento_id = r.id
      JOIN instituciones i
        ON i.id = ipr.institucion_id
      WHERE r.estado = 'completo'
        AND i.cue IS NOT NULL
        ${whereSql}
    `;

    const [cuiRows]: any[] = await pool.query(sqlCuis, params);
    const [cueRows]: any[] = await pool.query(sqlCues, params);

    const cuis = Number(cuiRows?.[0]?.cuis ?? 0);
    const cues = Number(cueRows?.[0]?.cues ?? 0);

    return NextResponse.json({ cuis, cues }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/resumen-relevado:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
