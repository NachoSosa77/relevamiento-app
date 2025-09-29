// /app/api/relevamientos/[id]/resumen/route.ts
import { getAberturasByRelevamientoIdAndLocalId } from "@/app/lib/server/aberturaDb";
import { getAcondicionamientoTermicoByRelevamientoId } from "@/app/lib/server/acondicionamientoTermincoDb";
import { getConstruccionesByRelevamientoId } from "@/app/lib/server/construccionesDb";
import { getEquipamientoCocinaOfficesByRelevamientoId } from "@/app/lib/server/equipamientoOfficeDb";
import { getEquipamientoSanitariosByRelevamientoId } from "@/app/lib/server/equipamientoSanitarioDb";
import { getIluminacionVentilacionByRelevamientoId } from "@/app/lib/server/iluminacionVentilacionDb";
import { getInstalacionesBasicasByRelevamientoId } from "@/app/lib/server/instalacionesBasicasDb";
import { getLocalesByConstruccionAndRelevamiento } from "@/app/lib/server/localesPorConstruccionDb";
import { getMaterialesPredominantesByRelevamientoId } from "@/app/lib/server/materialesPredominantesDb";
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
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

      return {
        ...construccion,
        locales: localesConDetalles,
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
