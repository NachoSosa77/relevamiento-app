import { getConnection } from "@/app/lib/db";
import { FormDataUser } from "@/interfaces/FormDataUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, dni, email, password }: FormDataUser =
      await req.json();
    const connection = await getConnection();

    const [existingUsers] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      connection.release();
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO users (nombre, apellido, dni, email, password) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, dni, email, hashedPassword]
    );
    connection.release();

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error en el registro", error },
      { status: 500 }
    );
  }
}
