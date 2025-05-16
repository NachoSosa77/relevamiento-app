import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    // Puede ser un array de registros
    for (const item of data) {
      const {
        corresponde,
        tipo_institucion,
        descripcion_otro,
        nombre_institucion,
        relevamiento_id,
      } = item;

      await connection.query(
        `INSERT INTO establecimientos_no_escolar (
          corresponde,
          tipo_institucion,
          descripcion_otro,
          nombre_institucion,
          relevamiento_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          corresponde,
          tipo_institucion,
          descripcion_otro,
          nombre_institucion,
          relevamiento_id,
        ]
      );
    }

    return NextResponse.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar establecimientos_no_escolar:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al guardar los datos" }),
      { status: 500 }
    );
  }
}
