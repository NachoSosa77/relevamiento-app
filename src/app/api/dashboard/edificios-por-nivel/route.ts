/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

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
    const localidad = url.searchParams.get("localidad")?.trim() || "";
    const cuiRaw = url.searchParams.get("cui");
    const cueRaw = url.searchParams.get("cue");

    const cui = cuiRaw && cuiRaw !== "" ? Number(cuiRaw) : null;
    const cue = cueRaw && cueRaw !== "" ? Number(cueRaw) : null;

    if (cuiRaw && (!Number.isFinite(cui) || (cui as number) <= 0))
      return NextResponse.json({ message: "cui inválido" }, { status: 400 });

    if (cueRaw && (!Number.isFinite(cue) || (cue as number) <= 0))
      return NextResponse.json({ message: "cue inválido" }, { status: 400 });

    const where: string[] = [];
    const params: any[] = [];

    // Provincia fija (según tu requerimiento actual)
    where.push(`i.provincia = 'La Pampa'`);

    // Solo relevamientos completos (para contar establecimientos efectivamente relevados)
    // Usamos la tabla puente para asegurar que el CUE está asociado a un relevamiento completo.
    where.push(`r.estado = 'completo'`);

    if (localidad) {
      where.push(`i.localidad = ?`);
      params.push(localidad);
    }
    if (cui != null) {
      where.push(`i.cui = ?`);
      params.push(cui);
    }
    if (cue != null) {
      where.push(`i.cue = ?`);
      params.push(cue);
    }

    const sql = `
      SELECT
        COALESCE(i.modalidad_nivel, 'SIN NIVEL') AS nivel,
        COUNT(DISTINCT i.cue) AS establecimientos
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr ON ipr.relevamiento_id = r.id
      JOIN instituciones i ON i.id = ipr.institucion_id
      WHERE ${where.join(" AND ")}
      GROUP BY COALESCE(i.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;

    const [rows]: any[] = await pool.query(sql, params);
    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/edificios-por-nivel (CUE):",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
