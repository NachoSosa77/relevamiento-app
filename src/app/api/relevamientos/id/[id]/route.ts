/* eslint-disable @typescript-eslint/no-unused-vars */
import { getConnection } from "@/app/lib/db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Relevamiento {
  id: number;
  cui_id: number;
  created_at: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const connection = await getConnection();
    const id = (await params).id;

    const [rows, _fields]: [Relevamiento[] & RowDataPacket[], FieldPacket[]] =
      await connection.query("SELECT * FROM relevamientos WHERE id = ?", [id]);

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
