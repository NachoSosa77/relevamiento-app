import { getConnection } from "@/app/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface ForgotPasswordRequest {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  let connection;
  try {
    const { email, password }: ForgotPasswordRequest = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y nueva contraseña son requeridos" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const [users] = await connection.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No se encontró usuario con ese email" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    return NextResponse.json(
      { message: "Contraseña actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar la contraseña",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
