// /api/dashboard/construcciones-por-conservacion/route.ts
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

    // Filtros opcionales
    const url = new URL(req.url);
    const provincia = url.searchParams.get("provincia"); // ej: "La Pampa"
    const localidad = url.searchParams.get("localidad");
    const params: any[] = [];

    // Contamos DESDE snapshot; sólo unimos instituciones si pedís filtros.
    const sql = `
      SELECT s.clasificacion, COUNT(*) AS construcciones
      FROM estado_construccion_snapshot s
      ${
        provincia || localidad
          ? `
      JOIN relevamientos r ON r.id = s.relevamiento_id
      JOIN (
        SELECT i.cui,
               SUBSTRING_INDEX(GROUP_CONCAT(i.provincia  ORDER BY i.id), ',', 1) AS provincia,
               SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad
        FROM instituciones i
        GROUP BY i.cui
      ) inst ON inst.cui = r.cui_id
      `
          : ``
      }
      WHERE 1=1
      ${provincia ? "AND UPPER(inst.provincia) = UPPER(?)" : ""}
      ${localidad ? "AND inst.localidad = ?" : ""}
      GROUP BY s.clasificacion
      ORDER BY FIELD(s.clasificacion,'Bueno','Regular','Malo');
    `;

    if (provincia && provincia.trim() !== "") params.push(provincia.trim());
    if (localidad && localidad.trim() !== "") params.push(localidad.trim());

    const [rows]: any[] = await pool.query(sql, params);

    // total (tipado para evitar TS7006)
    const total = (rows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    return NextResponse.json({ items: rows, total }, { status: 200 });
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/construcciones-por-conservacion:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
