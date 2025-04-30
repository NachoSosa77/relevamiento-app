/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection(); // Se debe usar "await" para obtener la conexión
  try {
    const body = await req.json();
    const { plantas, construccion_id } = body;

    console.log("Datos recibidos en el backend:", plantas);

    // Verificar si plantas es un objeto válido
    if (typeof plantas !== "object" || plantas === null) {
      throw new Error("plantas no es un objeto válido");
    }

    // Desestructurar las propiedades de plantas
    const { subsuelo, pb, pisos_superiores } = plantas;

    // Realizar la inserción en la base de datos
    const query = `
      INSERT INTO plantas (construccion_id, subsuelo, pb, pisos_superiores) 
      VALUES (?, ?, ?, ?)
    `;

    // Usamos await para ejecutar la consulta correctamente
    await connection.execute(query, [
      construccion_id,
      subsuelo || 0,
      pb || 0,
      pisos_superiores || 0,
    ]);

    return NextResponse.json(
      { message: "Plantas asociadas correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al asociar las plantas:", error);
    return NextResponse.json(
      {
        message: "Error al asociar las plantas:",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
