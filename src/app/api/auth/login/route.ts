import { getConnection } from "@/app/lib/db";
import { FormDataUser } from "@/interfaces/FormDataUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Debe ser POST, no una función llamada login
  try {
    const { email, password } = await req.json();

    const connection = await getConnection();

    const [users] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    connection.release();
    if (users.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = users[0] as FormDataUser;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }
    const payload = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "4h",
    });

    // 🛠️ Crear la respuesta con la cookie
    const response = NextResponse.json({ message: "Login exitoso" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("🔥 Error en el inicio de sesión:", error);
    return NextResponse.json(
      { message: "Error en el inicio de sesión", error },
      { status: 500 }
    );
  }
}
