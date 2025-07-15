/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

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
