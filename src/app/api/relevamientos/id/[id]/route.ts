/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getConnection } from "@/app/lib/db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Relevamiento {
  id: number;
  cui_id: number;
  created_at: string;
  created_by: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (Number.isNaN(idNumber)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const connection = await getConnection();

    const [rows, _fields]: [Relevamiento[] & RowDataPacket[], FieldPacket[]] =
      await connection.query("SELECT * FROM relevamientos WHERE id = ?", [
        idNumber,
      ]);

    connection.release();

    if (!rows.length) {
      return NextResponse.json(
        { message: "Relevamiento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]); // Solo el primer (y único) resultado
  } catch (error: unknown) {
    console.error("Error al obtener el relevamiento:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (Number.isNaN(idNumber)) {
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
      `UPDATE relevamientos SET estado = ? WHERE id = ?`,
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
