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
  { params }: { params: Promise<{ id: number }> }
) {
  const id = (await params).id;
  const conn: PoolConnection = await getConnection();

  try {
    const relevamiento = await getRelevamientoByIdServer(id);

    const construcciones = await getConstruccionesByRelevamientoId(id);

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
            id,
            construccion.id,
            conn
          ),
          getEnergiasAlternativasByConstruccionId(id, construccion.id, conn),
          getInstalacionesSeguridadIncendioByConstruccionId(
            id,
            construccion.id,
            conn
          ),
          getInstitucionesPorConstruccion(id, construccion.id, conn),
          getPlantasPorConstruccion(id, construccion.id, conn),
          getServicioAguaByRelevamientoId(id, construccion.id, conn),
          getServicioDesagueByRelevamientoId(id, construccion.id, conn),
          getServicioElectricidadByRelevamientoId(id, construccion.id, conn),
          getServicioGasByRelevamientoId(id, construccion.id, conn),
          getUsoComedorByRelevamientoId(id, construccion.id, conn),
          getEstadoConservacionByRelevamientoId(id, construccion.id, conn),
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
