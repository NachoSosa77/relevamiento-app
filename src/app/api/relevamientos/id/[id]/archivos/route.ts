// /app/api/relevamientos/[id]/resumen/route.ts
import { getArchivosByRelevamientoId } from "@/app/lib/server/archivosDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { NextResponse } from "next/server";
// ...otros imports

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const id = (await params).id;

  const relevamiento = await getRelevamientoByIdServer(id);
  const archivos = await getArchivosByRelevamientoId(id);
  // ...otros fetchs

  return NextResponse.json({
    relevamiento,
    archivos,
    // ...
  });
}
