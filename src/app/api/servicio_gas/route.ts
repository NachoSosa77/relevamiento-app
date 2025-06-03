/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/servicio_gas/route.ts
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { relevamiento_id, servicios } = await req.json();

  if (!relevamiento_id || !Array.isArray(servicios) || servicios.length === 0) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    // Iniciar una transacción
    await connection.beginTransaction();

    // Iteramos sobre los servicios para insertar cada uno
    for (const servicio of servicios) {
      const { servicio: nombreServicio, estado } = servicio;

      const [result] = await connection.execute(
        `INSERT INTO servicio_gas (relevamiento_id, servicio, estado)
        VALUES (?, ?, ?)`,
        [relevamiento_id, nombreServicio, estado]
      );

      // Si necesitas trabajar con el insertId, puedes hacerlo aquí
      const insertId = (result as any).insertId;
    }

    // Confirmar la transacción
    await connection.commit();

    return NextResponse.json({
      message: "Servicios gas guardados correctamente",
    });
  } catch (error) {
    console.error("Error en la inserción:", error);
    await connection.rollback();
    return NextResponse.json(
      { message: "Error al guardar los servicios" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
