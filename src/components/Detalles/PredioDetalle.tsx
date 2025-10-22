/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion } from "@/interfaces/Locales";
import { useAppDispatch } from "@/redux/hooks";
import { setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import { AreaExternaTable } from "./AreaExternaTable";
import { ConstruccionDetalleAccordion } from "./ConstruccionDetalleAcordion";
import ObservacionesDetailComponent from "./ObservacionesDetailComponent";
import { ServiciosBasicosTable } from "./ServiciosBasicos";

interface Props {
  relevamientoId: number;
}

interface Predio {
  cantidadConstrucciones: number | null;
  superficieTotalPredio: number | null;
  observaciones: string | null;
  cui: number;
  relevamientoId: number;
  predioId: number | null;
}

export const PredioDetalle = ({ relevamientoId }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [predio, setPredio] = useState<Predio>();
  const [construcciones, setConstrucciones] = useState<Construccion[]>([]);

  const handleEditar = () => {
    dispatch(setRelevamientoId(relevamientoId));
    router.push("/espacios-escolares"); // o la ruta que uses
  };

  const handleEditarConstruccion = () => {
    dispatch(setRelevamientoId(relevamientoId));
    router.push("/relevamiento-construcciones"); // o la ruta que uses
  };

  useEffect(() => {
    const fetchPredioYConstrucciones = async () => {
      try {
        const [espaciosRes, construccionesRes] = await Promise.all([
          fetch(`/api/espacios_escolares/${relevamientoId}`),
          fetch(`/api/construcciones?relevamiento_id=${relevamientoId}`),
        ]);

        // espacios_escolares
        if (espaciosRes.ok) {
          const ee = await espaciosRes.json();
          setPredio({
            cantidadConstrucciones: ee.cantidad_construcciones ?? 0,
            superficieTotalPredio: Number(ee.superficie_total_predio ?? 0),
            observaciones: ee.observaciones ?? "",
            cui: ee.cui,
            relevamientoId: ee.relevamiento_id, // map DB -> FE
            predioId: ee.predio_id, // map DB -> FE
          });
        } else if (espaciosRes.status === 404) {
          // No hay espacios_escolares cargado aún
          setPredio({
            cantidadConstrucciones: 0,
            superficieTotalPredio: 0,
            observaciones: "",
            cui: 0,
            relevamientoId,
            predioId: null,
          });
          toast.info(
            "No hay datos de espacios escolares para este relevamiento"
          );
        } else {
          throw new Error(`HTTP ${espaciosRes.status}`);
        }

        // construcciones
        const construccionesData = construccionesRes.ok
          ? await construccionesRes.json()
          : [];
        setConstrucciones(
          Array.isArray(construccionesData) ? construccionesData : []
        );
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar los datos del predio o construcciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPredioYConstrucciones();
  }, [relevamientoId]);

  console.log("Construcciones", construcciones);
  console.log("Predio", predio);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Información general del predio
          </h3>
          <button
            onClick={handleEditar}
            className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
          >
            Editar
          </button>
        </div>
        <p>
          <strong>Cantidad de construcciones:</strong>{" "}
          {predio?.cantidadConstrucciones}
        </p>
        <p>
          <strong>Superficie total:</strong> {predio?.superficieTotalPredio} m²
        </p>
        {predio?.observaciones && (
          <ObservacionesDetailComponent observaciones={predio.observaciones} />
        )}
      </div>
      <div>
        <AreaExternaTable relevamientoId={relevamientoId} />
      </div>

      {(predio?.cantidadConstrucciones ?? 0) > 0 && (
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Construcciones relevadas</h3>
          <button
            onClick={handleEditarConstruccion}
            className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
          >
            Editar Construcciones
          </button>

          {construcciones.length > 0 && (
            <div className="space-y-2">
              {construcciones.map((construccion, index) => (
                <ConstruccionDetalleAccordion
                  key={construccion.id}
                  construccion={construccion}
                  relevamientoId={relevamientoId}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <ServiciosBasicosTable relevamientoId={relevamientoId} />
    </div>
  );
};
