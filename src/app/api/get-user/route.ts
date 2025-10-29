/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /api/get-user/route.ts
import { getConnection } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value; // cookies() es sync
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const connection = await getConnection();
    // Traemos datos del usuario + roles (puede no tener)
    const [rows]: any[] = await connection.execute(
      `
      SELECT
        u.id, u.nombre, u.apellido, u.dni, u.email,
        COALESCE(GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ','), '') AS roles_csv
      FROM users u
      LEFT JOIN user_role ur ON ur.user_id = u.id
      LEFT JOIN role r       ON r.id = ur.role_id AND r.is_active = 1
      WHERE u.id = ?
      GROUP BY u.id, u.nombre, u.apellido, u.dni, u.email
      `,
      [userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const row = rows[0];
    const roles = row.roles_csv ? String(row.roles_csv).split(",") : [];

    return NextResponse.json(
      {
        id: row.id,
        nombre: row.nombre,
        apellido: row.apellido,
        dni: row.dni,
        email: row.email,
        roles, // <- acá llegan los roles: ["ADMIN", "ANALISTA", ...]
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}
