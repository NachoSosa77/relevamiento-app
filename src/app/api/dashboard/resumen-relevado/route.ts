/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/resumen-relevado?localidad=<opcional>
 * - Solo relevamientos con estado = "completo"
 * - CUI/CUE "relevados" via instituciones_por_relevamiento
 * - Filtro opcional por localidad (desde instituciones)
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
    const localidad = url.searchParams.get("localidad")?.trim();

    const whereLocalidad = localidad ? "AND i.localidad = ?" : "";
    const params: any[] = [];
    if (localidad) params.push(localidad);

    // 1) CUIs
    const sqlCuis = `
      SELECT COUNT(DISTINCT i.cui) AS cuis
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr ON ipr.relevamiento_id = r.id
      JOIN instituciones i ON i.id = ipr.institucion_id
      WHERE r.estado = 'completo'
        AND i.cui IS NOT NULL
        ${whereLocalidad}
    `;

    // 2) CUEs
    const sqlCues = `
      SELECT COUNT(DISTINCT i.cue) AS cues
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr ON ipr.relevamiento_id = r.id
      JOIN instituciones i ON i.id = ipr.institucion_id
      WHERE r.estado = 'completo'
        AND i.cue IS NOT NULL
        ${whereLocalidad}
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
