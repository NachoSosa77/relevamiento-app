import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const { cui } = body;

    if (!cui) {
      return NextResponse.json(
        { message: "CUI es requerido" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO relevamientos (cui_id) VALUES (?)`,
      [cui]
    );

    connection.release();

    return NextResponse.json({
      message: "Relevamiento creado correctamente",
      inserted: { id: result.insertId, cui },
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
