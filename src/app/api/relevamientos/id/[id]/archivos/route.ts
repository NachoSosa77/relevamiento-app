// /app/api/relevamientos/[id]/resumen/route.ts
import { getArchivosByRelevamientoId } from "@/app/lib/server/archivosDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { NextResponse } from "next/server";
// ...otros imports

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const relevamiento = await getRelevamientoByIdServer(numericId);
  const archivos = await getArchivosByRelevamientoId(numericId);
  // ...otros fetchs

  return NextResponse.json({
    relevamiento,
    archivos,
    // ...
  });
}
