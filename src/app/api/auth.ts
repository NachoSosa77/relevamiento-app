// pages/api/auth.ts
import { FormDataUser } from "@/interfaces/FormDataUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../lib/db";
//import { query } from '../../lib/db'; // Importa tu función de consulta a la base de datos

type Data = {
  message?: string;
  token?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | FormDataUser | FormDataUser[]>
) {
  if (req.method === "POST") {
    if (req.url === "/api/auth/register") {
      await register(req, res);
    } else if (req.url === "/api/auth/login") {
      await login(req, res);
    } else {
      res.status(404).json({ message: "Ruta no encontrada" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}

async function register(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { nombre, apellido, email, password } = req.body;

  try {
    // 1. Verifica si el usuario ya existe
    const existingUsers = await query<FormDataUser>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // 2. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Inserta el nuevo usuario en la base de datos
    const result = await query<FormDataUser>(
      "INSERT INTO users (nombre, apellido, email, password) VALUES (?, ?, ?, ?)",
      [nombre, apellido, email, hashedPassword]
    );

    // 4. Genera un token JWT
    const token = jwt.sign({ id: result[0].id }, "relevamiento-secret", {
      expiresIn: "1h",
    });

    // 5. Envía la respuesta con el token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el registro" });
  }
}

async function login(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email, password } = req.body;

  try {
    // 1. Verifica si el usuario existe
    const users = await query<FormDataUser>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = users[0];
    const hashedPasswordFromDB = user.password;

    // 2. Compara la contraseña ingresada con la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDB);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const payload = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    };

    // 3. Genera un token JWT
    const token = jwt.sign(payload, "relevamiento-secret", { expiresIn: "1h" });

    // 4. Envía la respuesta con el token
    res.json({ token });
  } catch (error) {
    console.error("Error inesperado:", error);
    res
      .status(500)
      .json({ message: "Error inesperado en el inicio de sesión" });
  }
}
