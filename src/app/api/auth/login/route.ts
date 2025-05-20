import { getConnection } from "@/app/lib/db";
import { FormDataUser } from "@/interfaces/FormDataUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Debe ser POST, no una función llamada login
  console.log("📩 Recibiendo solicitud de login...");
  try {
    const { email, password } = await req.json();
    console.log("📨 Datos recibidos:", { email });
    console.log("📨 Datos recibidos:", { password });

    const connection = await getConnection();
    console.log("🔗 Conexión establecida con la base de datos");

    const [users] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("🔎 Usuarios encontrados:", users);

    if (users.length === 0) {
      console.log("No se encontró ningún usuario con ese email.");
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    connection.release();
    if (users.length === 0) {
      console.log("Credenciales inválidas");
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = users[0] as FormDataUser;
    console.log("🔑 Usuario encontrado:", password);
    console.log("🔑 Usuario encontrado:", user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Passwords coinciden:", passwordMatch);

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
      expiresIn: "1h",
    });

    console.log("✅ Token generado:", token);

    // 🛠️ Crear la respuesta con la cookie
    const response = NextResponse.json({ message: "Login exitoso" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hora
      path: "/",
    });

    console.log("🍪 Cookie establecida con el token");

    return response;
  } catch (error) {
    console.error("🔥 Error en el inicio de sesión:", error);
    return NextResponse.json(
      { message: "Error en el inicio de sesión", error },
      { status: 500 }
    );
  }
}
