import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const relevamiento_id = searchParams.get("relevamiento_id");
    const construccion_id = searchParams.get("construccion_id");

    if (!relevamiento_id || !construccion_id) {
      return NextResponse.json(
        { message: "Faltan parámetros" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM servicio_desague WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET servicio_desague:", error);
    return NextResponse.json({ message: "Error en consulta" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { relevamiento_id, servicios, construccion_id } = await req.json();

  if (!relevamiento_id || !Array.isArray(servicios) || servicios.length === 0) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    for (const servicio of servicios) {
      const { servicio: nombreServicio, estado } = servicio;

      await connection.execute(
        `INSERT INTO servicio_desague (relevamiento_id, construccion_id, servicio, estado)
         VALUES (?, ?, ?, ?)`,
        [relevamiento_id, construccion_id, nombreServicio, estado]
      );
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({
      message: "Servicios desagüe guardados correctamente",
    });
  } catch (error) {
    console.error("Error en la inserción:", error);
    await connection.rollback();
    connection.release();
    return NextResponse.json(
      { message: "Error al guardar los servicios" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { relevamiento_id, servicios, construccion_id } = await req.json();

  if (!relevamiento_id || !Array.isArray(servicios) || servicios.length === 0) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Por simplicidad, borramos los servicios existentes para luego insertar los nuevos
    await connection.execute(
      `DELETE FROM servicio_desague WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    for (const servicio of servicios) {
      const { servicio: nombreServicio, estado } = servicio;

      await connection.execute(
        `INSERT INTO servicio_desague (relevamiento_id, construccion_id, servicio, estado)
         VALUES (?, ?, ?, ?)`,
        [relevamiento_id, construccion_id, nombreServicio, estado]
      );
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({
      message: "Servicios desagüe actualizados correctamente",
    });
  } catch (error) {
    console.error("Error en la actualización:", error);
    await connection.rollback();
    connection.release();
    return NextResponse.json(
      { message: "Error al actualizar los servicios" },
      { status: 500 }
    );
  }
}
