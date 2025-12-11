// /app/api/relevamientos/[id]/resumen/route.ts
import { getConnection } from "@/app/lib/db";
import { getCondicionesAccesibilidadByConstruccionId } from "@/app/lib/server/condicionesAccesibilidadDb";
import { getConstruccionesByRelevamientoId } from "@/app/lib/server/construccionesDb";
import { getEnergiasAlternativasByConstruccionId } from "@/app/lib/server/energiasalternativasDb";
import { getEstadoConservacionByRelevamientoId } from "@/app/lib/server/estadoConservacionDb";
import { getInstalacionesSeguridadIncendioByConstruccionId } from "@/app/lib/server/instalacionesSeguridadIncendioDb";
import { getInstitucionesPorConstruccion } from "@/app/lib/server/institucionesConstruccionDb";
import { getPlantasPorConstruccion } from "@/app/lib/server/plantasconstruccionDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { getServicioAguaByRelevamientoId } from "@/app/lib/server/servicioAguaDb";
import { getServicioDesagueByRelevamientoId } from "@/app/lib/server/servicioDesagueDb";
import { getServicioElectricidadByRelevamientoId } from "@/app/lib/server/servicioElectricidadDb";
import { getServicioGasByRelevamientoId } from "@/app/lib/server/servicioGasDb";
import { getUsoComedorByRelevamientoId } from "@/app/lib/server/usoComedorDb";
import { PoolConnection } from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }
  const conn: PoolConnection = await getConnection();

  try {
    const relevamiento = await getRelevamientoByIdServer(numericId);

    const construcciones = await getConstruccionesByRelevamientoId(numericId);

    const construccionesConLocales = await Promise.all(
      construcciones.map(async (construccion) => {
        const [
          condicionesAccesibilidad,
          energiasAlternativas,
          instalacionesSeguridadIncendio,
          instituciones,
          plantas,
          servicioAgua,
          servicioDesague,
          servicioElectricidad,
          servicioGas,
          servicioComedor,
          estadoConservacion,
        ] = await Promise.all([
          getCondicionesAccesibilidadByConstruccionId(
            numericId,
            construccion.id,
            conn
          ),
          getEnergiasAlternativasByConstruccionId(
            numericId,
            construccion.id,
            conn
          ),
          getInstalacionesSeguridadIncendioByConstruccionId(
            numericId,
            construccion.id,
            conn
          ),
          getInstitucionesPorConstruccion(numericId, construccion.id),
          getPlantasPorConstruccion(numericId, construccion.id, conn),
          getServicioAguaByRelevamientoId(numericId, construccion.id, conn),
          getServicioDesagueByRelevamientoId(numericId, construccion.id, conn),
          getServicioElectricidadByRelevamientoId(
            numericId,
            construccion.id,
            conn
          ),
          getServicioGasByRelevamientoId(numericId, construccion.id, conn),
          getUsoComedorByRelevamientoId(numericId, construccion.id, conn),
          getEstadoConservacionByRelevamientoId(
            numericId,
            construccion.id,
            conn
          ),
        ]);

        return {
          ...construccion,
          instituciones,
          plantas,
          servicioAgua,
          servicioDesague,
          servicioGas,
          servicioElectricidad,
          instalacionesSeguridadIncendio,
          condicionesAccesibilidad,
          energiasAlternativas,
          servicioComedor,
          estadoConservacion,
        };
      })
    );

    return NextResponse.json({
      relevamiento,
      construcciones: construccionesConLocales,
      // ...
    });
  } finally {
    conn.release();
  }
}
