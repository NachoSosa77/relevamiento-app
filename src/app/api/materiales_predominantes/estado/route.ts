// src/app/api/materiales_predominantes/estado/route.ts
import { pool } from "@/app/lib/db";
import { computeLocalScore } from "@/app/lib/estado-local"; // la función que armamos recién
import { NextRequest, NextResponse } from "next/server";

type RowDB = {
  item: string | null;
  material: string | null;
  estado: string | null;
  relevamiento_id: number;
  local_id: number;
};

export async function GET(req: NextRequest) {
  try {
    const localId = Number(req.nextUrl.searchParams.get("localId"));
    const relevamientoId = Number(
      req.nextUrl.searchParams.get("relevamientoId")
    );

    if (!localId || !relevamientoId) {
      return new NextResponse("Faltan parámetros localId o relevamientoId", {
        status: 400,
      });
    }

    const [rows] = await pool.execute(
      `SELECT item, material, estado, relevamiento_id, local_id 
       FROM materiales_predominantes 
       WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    const materiales = (rows as RowDB[]).map((r) => ({
      item: r.item,
      material: r.material,
      estado: r.estado,
      relevamiento_id: r.relevamiento_id,
      local_id: r.local_id,
    }));

    const estadoLocal = computeLocalScore(materiales);

    return NextResponse.json({
      local_id: localId,
      relevamiento_id: relevamientoId,
      materiales, // por si el dashboard quiere ver el detalle crudo
      estado_local: estadoLocal, // { score, clasificacion, detalle, tieneCriticoMalo }
    });
  } catch (error) {
    console.error("Error en GET /materiales_predominantes/estado:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}
