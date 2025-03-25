import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { observacion, espacio_escolar_id } = await req.json();

    if (!observacion || !espacio_escolar_id) {
      return NextResponse.json(
        { message: "Datos incompletos" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    await connection.query(
      "INSERT INTO observaciones (espacio_escolar_id, observacion) VALUES (?, ?)",
      [espacio_escolar_id, observacion]
    );
    connection.release();

    return NextResponse.json(
      { message: "Observación guardada correctamente" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al guardar la observación",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
