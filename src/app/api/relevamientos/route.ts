/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/relevamientos
 * Query params:
 *  - scope: "all" | "mine" (default: "mine")
 *  - page, pageSize
 *  - cui, created_by, estado
 *  - fecha_desde (YYYY-MM-DD), fecha_hasta (YYYY-MM-DD)
 */

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const { cui, created_by, usuario_id, email } = body;

    if (!cui || !created_by || !usuario_id || !email) {
      return NextResponse.json(
        { message: "Faltan datos: cui, created_by, usuario_id o email" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO relevamientos (cui_id, estado, created_by, usuario_id, email) VALUES (?, ?, ?, ?, ?)`,
      [cui, "incompleto", created_by, usuario_id, email]
    );

    connection.release();

    // Crear respuesta JSON
    const response = NextResponse.json({
      message: "Relevamiento creado correctamente",
      inserted: {
        id: result.insertId,
        cui,
        estado: "incompleto",
        created_by,
        usuario_id,
        email,
      },
    });

    // Setear cookie httpOnly con el relevamientoId
    response.cookies.set("relevamientoId", String(result.insertId), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err: any) {
    console.error("Error al crear el relevamiento:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const conn = await getConnection();
  try {
    // --- Auth básica por cookie JWT (mismo criterio que /api/get-user)
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    // --- Params
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope") ?? "mine";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("pageSize") ?? 25))
    );

    const cui = url.searchParams.get("cui");
    const created_by = url.searchParams.get("created_by");
    const estado = url.searchParams.get("estado");
    const fecha_desde = url.searchParams.get("fecha_desde"); // YYYY-MM-DD
    const fecha_hasta = url.searchParams.get("fecha_hasta"); // YYYY-MM-DD

    // --- Guard para scope=all (solo ADMIN)
    if (scope === "all") {
      const [isAdminRows] = await conn.query<any[]>(
        `
        SELECT 1
        FROM user_role ur
        JOIN role r ON r.id = ur.role_id AND r.is_active = 1
        WHERE ur.user_id = ? AND r.name = 'ADMIN'
        LIMIT 1
        `,
        [userId]
      );
      const isAdmin = Array.isArray(isAdminRows) && isAdminRows.length > 0;
      if (!isAdmin)
        return NextResponse.json({ message: "Sin permiso" }, { status: 403 });
    }

    // --- WHERE dinámico
    const where: string[] = [];
    const params: any[] = [];

    if (scope === "mine") {
      where.push(`r.usuario_id = ?`);
      params.push(userId);
    }

    if (cui) {
      where.push(`r.cui_id = ?`);
      params.push(cui);
    }
    if (created_by) {
      where.push(`r.created_by LIKE ?`);
      params.push(`%${created_by}%`);
    }
    if (estado) {
      where.push(`r.estado = ?`);
      params.push(estado);
    }
    if (fecha_desde) {
      where.push(`r.created_at >= ?`);
      params.push(`${fecha_desde} 00:00:00`);
    }
    if (fecha_hasta) {
      where.push(`r.created_at <= ?`);
      params.push(`${fecha_hasta} 23:59:59`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // --- Total
    const [countRes] = await conn.query<any[]>(
      `SELECT COUNT(1) AS total FROM relevamientos r ${whereSql}`,
      params
    );
    const total =
      Array.isArray(countRes) && countRes[0]?.total
        ? Number(countRes[0].total)
        : 0;

    // --- Datos (ordeno por fecha si está, si no por id DESC)
    // si tu tabla no tiene created_at, cambiá ORDER BY r.id DESC
    const [items] = await conn.query<any[]>(
      `
      SELECT
        r.id,
        r.cui_id,
        r.estado,
        r.created_by,
        r.usuario_id,
        r.email,
        r.created_at
      FROM relevamientos r
      ${whereSql}
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pageSize, (page - 1) * pageSize]
    );

    return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
  } catch (err: any) {
    console.error("Error GET /api/relevamientos:", err);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
