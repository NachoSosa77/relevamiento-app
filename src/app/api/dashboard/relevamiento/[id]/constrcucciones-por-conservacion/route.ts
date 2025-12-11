/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/relevamiento/[id]/construcciones-por-conservacion
 *
 * - Cuenta construcciones por clasificacion (Bueno / Regular / Malo)
 *   para UN solo relevamiento.
 * - Usa estado_construccion_snapshot.
 * - Opcionalmente chequea que el relevamiento esté 'completo'.
 * - Solo ADMIN.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth
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

    const { id } = await params;
    const relevamientoId = Number(id);
    if (!relevamientoId || Number.isNaN(relevamientoId)) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    // Contamos DESDE snapshot, pero acotado a un relevamiento.
    // Sumamos join con relevamientos para asegurarnos que esté 'completo'
    const sql = `
      SELECT s.clasificacion, COUNT(*) AS construcciones
      FROM estado_construccion_snapshot s
      JOIN relevamientos r ON r.id = s.relevamiento_id
      WHERE s.relevamiento_id = ?
        AND r.estado = 'completo'
      GROUP BY s.clasificacion
      ORDER BY FIELD(s.clasificacion,'Bueno','Regular','Malo');
    `;

    const [rows]: any[] = await pool.query(sql, [relevamientoId]);

    const total = (rows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    return NextResponse.json(
      {
        relevamientoId,
        items: rows,
        total,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/relevamiento/[id]/construcciones-por-conservacion:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
