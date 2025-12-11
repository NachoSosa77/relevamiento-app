// /app/api/relevamientos/[id]/resumen/route.ts
import { getAreasExterioresByRelevamiento } from "@/app/lib/server/areasExteriores";
import { getEspaciosEscolaresByRelevamientonId } from "@/app/lib/server/espaciosescolaresDb";
import { getInstitucionesRelacionadasByRelevamientoId } from "@/app/lib/server/institucionesRelevamiento";
import { getPrediosByRelevamientoId } from "@/app/lib/server/predioDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { getRespondientesByRelevamientoId } from "@/app/lib/server/respondientesDb";
import { getVisitasByRelevamientoIdServer } from "@/app/lib/server/visitasDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const relevamientoId = Number(id);
  if (Number.isNaN(relevamientoId)) {
    return NextResponse.json(
      { message: "ID de relevamiento inválido" },
      { status: 400 }
    );
  }

  const relevamiento = await getRelevamientoByIdServer(relevamientoId);
  const visitas = await getVisitasByRelevamientoIdServer(relevamientoId);
  const respondientes = await getRespondientesByRelevamientoId(relevamientoId);
  const predio = await getPrediosByRelevamientoId(relevamientoId);
  const espacioEscolar = await getEspaciosEscolaresByRelevamientonId(
    relevamientoId
  );
  const instituciones = await getInstitucionesRelacionadasByRelevamientoId(
    relevamientoId
  );
  const areasExteriores = await getAreasExterioresByRelevamiento(
    relevamientoId
  );

  return NextResponse.json({
    relevamiento,
    visitas,
    respondientes,
    predio,
    espacioEscolar,
    instituciones,
    areasExteriores,
  });
}
