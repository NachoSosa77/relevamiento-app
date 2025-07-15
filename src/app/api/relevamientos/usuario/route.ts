/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Relevamiento {
  id: number;
  cui_id: number;
  created_at: string;
  created_by: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Validar y decodificar token
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { email?: string };

    const email = decoded?.email;

    if (!email) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const connection = await getConnection();

    const [rows, _fields]: [Relevamiento[] & RowDataPacket[], FieldPacket[]] =
      await connection.query(
        "SELECT * FROM relevamientos WHERE created_by = ? ORDER BY created_at DESC",
        [email]
      );

    connection.release();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener relevamientos del usuario:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
