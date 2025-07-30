// /app/api/relevamientos/[id]/resumen/route.ts
import { getAberturasByRelevamientoIdAndLocalId } from "@/app/lib/server/aberturaDb";
import { getAcondicionamientoTermicoByRelevamientoId } from "@/app/lib/server/acondicionamientoTermincoDb";
import { getCondicionesAccesibilidadByConstruccionId } from "@/app/lib/server/condicionesAccesibilidadDb";
import { getConstruccionesByRelevamientoId } from "@/app/lib/server/construccionesDb";
import { getEnergiasAlternativasByConstruccionId } from "@/app/lib/server/energiasalternativasDb";
import { getEquipamientoCocinaOfficesByRelevamientoId } from "@/app/lib/server/equipamientoOfficeDb";
import { getEquipamientoSanitariosByRelevamientoId } from "@/app/lib/server/equipamientoSanitarioDb";
import { getEstadoConservacionByRelevamientoId } from "@/app/lib/server/estadoConservacionDb";
import { getIluminacionVentilacionByRelevamientoId } from "@/app/lib/server/iluminacionVentilacionDb";
import { getInstalacionesBasicasByRelevamientoId } from "@/app/lib/server/instalacionesBasicasDb";
import { getInstalacionesSeguridadIncendioByConstruccionId } from "@/app/lib/server/instalacionesSeguridadIncendioDb";
import { getInstitucionesPorConstruccion } from "@/app/lib/server/institucionesConstruccionDb";
import { getLocalesByConstruccionAndRelevamiento } from "@/app/lib/server/localesPorConstruccionDb";
import { getMaterialesPredominantesByRelevamientoId } from "@/app/lib/server/materialesPredominantesDb";
import { getPlantasPorConstruccion } from "@/app/lib/server/plantasconstruccionDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { getServicioAguaByRelevamientoId } from "@/app/lib/server/servicioAguaDb";
import { getServicioDesagueByRelevamientoId } from "@/app/lib/server/servicioDesagueDb";
import { getServicioElectricidadByRelevamientoId } from "@/app/lib/server/servicioElectricidadDb";
import { getServicioGasByRelevamientoId } from "@/app/lib/server/servicioGasDb";
import { getUsoComedorByRelevamientoId } from "@/app/lib/server/usoComedorDb";
import { NextResponse } from "next/server";
// ...otros imports

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const id = (await params).id;

  const relevamiento = await getRelevamientoByIdServer(id);
  const construcciones = await getConstruccionesByRelevamientoId(id);
  const construccionesConLocales = await Promise.all(
    construcciones.map(async (construccion) => {
      const locales = await getLocalesByConstruccionAndRelevamiento(
        id,
        construccion.id
      );

      const localesConDetalles = await Promise.all(
        locales.map(async (local) => {
          const [
            aberturas,
            acondicionamientoTermico,
            equipamientoCocina,
            equipamientoSanitario,
            iluminacionVentilacion,
            instalacionesBasicas,
            materialesPredominantes,
          ] = await Promise.all([
            getAberturasByRelevamientoIdAndLocalId(id, local.id),
            getAcondicionamientoTermicoByRelevamientoId(id, local.id),
            getEquipamientoCocinaOfficesByRelevamientoId(id, local.id),
            getEquipamientoSanitariosByRelevamientoId(id, local.id),
            getIluminacionVentilacionByRelevamientoId(id, local.id),
            getInstalacionesBasicasByRelevamientoId(id, local.id),
            getMaterialesPredominantesByRelevamientoId(id, local.id),
          ]);

          return {
            ...local,
            aberturas,
            acondicionamientoTermico,
            equipamientoCocina,
            equipamientoSanitario,
            iluminacionVentilacion,
            instalacionesBasicas,
            materialesPredominantes,
          };
        })
      );

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
        getCondicionesAccesibilidadByConstruccionId(id, construccion.id),
        getEnergiasAlternativasByConstruccionId(id, construccion.id),
        getInstalacionesSeguridadIncendioByConstruccionId(id, construccion.id),
        getInstitucionesPorConstruccion(id, construccion.id),
        getPlantasPorConstruccion(id, construccion.id),
        getServicioAguaByRelevamientoId(id, construccion.id),
        getServicioDesagueByRelevamientoId(id, construccion.id),
        getServicioElectricidadByRelevamientoId(id, construccion.id),
        getServicioGasByRelevamientoId(id, construccion.id),
        getUsoComedorByRelevamientoId(id, construccion.id),
        getEstadoConservacionByRelevamientoId(id, construccion.id),
      ]);

      return {
        ...construccion,
        locales: localesConDetalles,
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
  // ...otros fetchs

  return NextResponse.json({
    relevamiento,
    construcciones: construccionesConLocales,
    // ...
  });
}
