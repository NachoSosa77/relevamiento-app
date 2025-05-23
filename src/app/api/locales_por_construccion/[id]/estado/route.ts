/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { estado } = body;

    if (!estado || typeof estado !== "string") {
      return NextResponse.json(
        { message: "El campo 'estado' es obligatorio y debe ser string" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [result] = await connection.query(
      `UPDATE locales_por_construccion SET estado = ? WHERE id = ?`,
      [estado, idNumber]
    );

    connection.release();

    return NextResponse.json({
      message: "Estado actualizado correctamente",
      result,
    });
  } catch (error: any) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
