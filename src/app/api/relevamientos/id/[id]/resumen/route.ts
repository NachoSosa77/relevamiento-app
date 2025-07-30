// /app/api/relevamientos/[id]/resumen/route.ts
import { getEspaciosEscolaresByRelevamientonId } from "@/app/lib/server/espaciosescolaresDb";
import { getPrediosByRelevamientoId } from "@/app/lib/server/predioDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { getRespondientesByRelevamientoId } from "@/app/lib/server/respondientesDb";
import { getVisitasByRelevamientoIdServer } from "@/app/lib/server/visitasDb";
import { NextResponse } from "next/server";
// ...otros imports

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const id = (await params).id;

  const relevamiento = await getRelevamientoByIdServer(id);
  const visitas = await getVisitasByRelevamientoIdServer(id);
  const respondientes = await getRespondientesByRelevamientoId(id);
  const predio = await getPrediosByRelevamientoId(id);
  const espacioEscolar = await getEspaciosEscolaresByRelevamientonId(id);

  // ...otros fetchs

  return NextResponse.json({
    relevamiento,
    visitas,
    respondientes,
    predio,
    espacioEscolar,
    // ...
  });
}
