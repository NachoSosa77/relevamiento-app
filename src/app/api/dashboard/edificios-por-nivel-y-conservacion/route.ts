// Nuevo Endpoint: /api/dashboard/edificios-por-nivel-y-conservacion
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/edificios-por-nivel-y-conservacion?localidad=<opcional>
 * - Provincia fija: "La Pampa"
 * - Solo relevamientos con estado = "completo"
 * - Muestra la cantidad de construcciones AGRUPADAS por Nivel Educativo y Estado de Conservación.
 * - Solo ADMIN
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Autenticación y Autorización (Admin)
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

    // 2. Parámetros
    const url = new URL(req.url);
    const localidad = url.searchParams.get("localidad");
    const params: any[] = [];

    // 3. Query
    const sql = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        s.clasificacion AS conservacion,
        COUNT(s.construccion_id) AS construcciones
      FROM relevamientos r
      
      -- Subconsulta de Instituciones (desduplicadas por CUI y obteniendo nivel)
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      ) inst ON inst.cui = r.cui_id
      
      -- Unión con el Estado de Conservación (Snapshot)
      JOIN estado_construccion_snapshot s ON s.relevamiento_id = r.id
      
      WHERE r.estado = 'completo'
        ${localidad ? "AND inst.localidad = ?" : ""}
      
      -- Agrupación por Nivel Educativo y Clasificación de Conservación
      GROUP BY
        nivel,
        conservacion
      
      -- Ordenamiento: Primero por Nivel y luego por la clasificación (Bueno, Regular, Malo)
      ORDER BY
        nivel,
        FIELD(conservacion, 'Bueno', 'Regular', 'Malo');
    `;

    if (localidad && localidad.trim() !== "") params.push(localidad.trim());

    const [rows]: any[] = await pool.query(sql, params);

    // 4. Calcular Total (opcional, si se requiere el total general de construcciones)
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
