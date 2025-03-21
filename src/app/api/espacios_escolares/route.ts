/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const connection = await getConnection();
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM espacios_escolares WHERE id = ?",
      [id]
    );
    connection.release();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Espacio escolar no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]); // ✅ Devolver solo un objeto en lugar de un array
  } catch (err: any) {
    console.error("Error al obtener el espacio escolar:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    const { institucion, plano, area_exterior_id, local_id, observaciones } =
      data;

    await connection.query(
      "INSERT INTO espacios_escolares (institucion, plano, area_exterior_id, local_id, observaciones) VALUES (?,?,?,?,?)",
      [institucion, plano, area_exterior_id, local_id, observaciones]
    );
    connection.release();
    return NextResponse.json(
      { message: "Espacio escolar insertado correctamente" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar espacio escolar:", err);
    return NextResponse.json(
      { message: "Error al insertar espacio escolar", error: err.message },
      { status: 500 }
    );
  }
}
