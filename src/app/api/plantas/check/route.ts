/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();
    const { construccion_id, relevamiento_id } = body;

    if (!construccion_id || !relevamiento_id) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const [rows]: any = await connection.execute(
      `SELECT id, subsuelo, pb, pisos_superiores FROM plantas WHERE construccion_id = ? AND relevamiento_id = ? LIMIT 1`,
      [construccion_id, relevamiento_id]
    );

    if (rows.length > 0) {
      const planta = rows[0];
      return NextResponse.json(
        {
          exists: true,
          planta_id: planta.id,
          subsuelo: planta.subsuelo,
          pb: planta.pb,
          pisos_superiores: planta.pisos_superiores,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error en plantas/check:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
