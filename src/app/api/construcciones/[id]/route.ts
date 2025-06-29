/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/construcciones/[id]/route.ts
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await getConnection();

    // Obtenemos la construcción por id
    const [rows] = await connection.query(
      "SELECT * FROM construcciones WHERE id = ? LIMIT 1",
      [id]
    );
    connection.release();

    const construccion =
      Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!construccion) {
      return NextResponse.json(
        { message: "Construcción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(construccion, { status: 200 });
  } catch (err: any) {
    console.error("Error al obtener la construcción:", err);
    return NextResponse.json(
      { message: "Error en el servidor", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { antiguedad, destino, observaciones } = body;

    if (!antiguedad && !destino && !observaciones) {
      return NextResponse.json(
        {
          message:
            "Se requiere al menos antigüedad, destino u observaciones para actualizar",
        },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const fields: string[] = [];
    const values: any[] = [];

    if (antiguedad) {
      fields.push("antiguedad = ?");
      values.push(antiguedad);
    }

    if (destino) {
      fields.push("destino = ?");
      values.push(destino);
    }

    if (observaciones) {
      fields.push("observaciones = ?");
      values.push(observaciones);
    }

    values.push(id); // Para el WHERE

    const query = `
      UPDATE construcciones
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    await connection.query(query, values);
    connection.release();

    return NextResponse.json(
      { message: "Construcción actualizada correctamente" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error al actualizar la construcción:", err);
    return NextResponse.json(
      { message: "Error en el servidor", error: err.message },
      { status: 500 }
    );
  }
}
