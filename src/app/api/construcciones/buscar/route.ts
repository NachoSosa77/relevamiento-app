import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const relevamientoId = searchParams.get("relevamiento_id");
  const numeroConstruccion = searchParams.get("numero_construccion");

  if (!relevamientoId || !numeroConstruccion) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT id FROM construcciones 
       WHERE relevamiento_id = ? AND numero_construccion = ? LIMIT 1`,
      [relevamientoId, numeroConstruccion]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const construccion_id = (rows[0] as any).id;
      return NextResponse.json({ existe: true, construccion_id });
    } else {
      return NextResponse.json({ existe: false });
    }
  } catch (error) {
    console.error("Error al buscar construcción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
