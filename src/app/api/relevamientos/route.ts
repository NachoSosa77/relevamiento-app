import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const { cui, created_by } = body;

    if (!cui || !created_by) {
      return NextResponse.json(
        { message: "CUI y usuarioId son requeridos" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO relevamientos (cui_id, estado, created_by) VALUES (?, ?, ?)`,
      [cui, "incompleto", created_by]
    );

    connection.release();

    return NextResponse.json({
      message: "Relevamiento creado correctamente",
      inserted: {
        id: result.insertId,
        cui,
        estado: "incompleto",
        created_by,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error al crear el relevamiento:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
