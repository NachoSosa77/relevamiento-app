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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const relevamiento = await getRelevamientoByIdServer(numericId);
  const construcciones = await getConstruccionesByRelevamientoId(numericId);
  const construccionesConLocales = await Promise.all(
    construcciones.map(async (construccion) => {
      const locales = await getLocalesByConstruccionAndRelevamiento(
        numericId,
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
            getAberturasByRelevamientoIdAndLocalId(numericId, local.id),
            getAcondicionamientoTermicoByRelevamientoId(numericId, local.id),
            getEquipamientoCocinaOfficesByRelevamientoId(numericId, local.id),
            getEquipamientoSanitariosByRelevamientoId(numericId, local.id),
            getIluminacionVentilacionByRelevamientoId(numericId, local.id),
            getInstalacionesBasicasByRelevamientoId(numericId, local.id),
            getMaterialesPredominantesByRelevamientoId(numericId, local.id),
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
