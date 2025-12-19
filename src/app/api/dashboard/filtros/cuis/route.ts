/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/filtros/cuis?localidad=<opcional>&search=<opcional>&limit=<opcional>&offset=<opcional>
 * - Devuelve CUIs (DISTINCT) de relevamientos completos y relevados (IPR)
 * - Solo ADMIN
 */
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
    const localidad = url.searchParams.get("localidad")?.trim();
    const search = url.searchParams.get("search")?.trim();
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 200), 500);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

    const where: string[] = ["r.estado = 'completo'", "i.cui IS NOT NULL"];
    const params: any[] = [];

    if (localidad) {
      where.push("i.localidad = ?");
      params.push(localidad);
    }

    if (search) {
      // CUI es INT, lo casteamos a CHAR para búsqueda parcial
      where.push("CAST(i.cui AS CHAR) LIKE CONCAT('%', ?, '%')");
      params.push(search);
    }

    const sql = `
      SELECT DISTINCT i.cui
      FROM relevamientos r
      JOIN instituciones_por_relevamiento ipr ON ipr.relevamiento_id = r.id
      JOIN instituciones i ON i.id = ipr.institucion_id
      WHERE ${where.join("\n  AND ")}
      ORDER BY i.cui
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const [rows]: any[] = await pool.query(sql, params);
    const items = (rows ?? [])
      .map((x: any) => Number(x.cui))
      .filter((n: any) => !Number.isNaN(n));

    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/filtros/cuis:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
