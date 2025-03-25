import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { observations, contextId, categoria } = await req.json();

    if (!observations || !contextId || !categoria) {
      return NextResponse.json(
        { message: "Datos incompletos" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    await connection.query(
      "INSERT INTO observaciones (context_id, observacion, categoria) VALUES (?, ?, ?)",
      [contextId, observations, categoria]
    );
    connection.release();

    return NextResponse.json(
      { message: "Observación guardada con éxito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al guardar observación:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
