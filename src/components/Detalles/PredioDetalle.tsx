/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion } from "@/interfaces/Locales";
import { predioService } from "@/services/Predio/predioService";
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
  cantidad_construcciones: number;
  superficie_total_predio: string;
  plano: string;
  observaciones: string;
}

export const PredioDetalle = ({ relevamientoId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [predio, setPredio] = useState<Predio>();
  const [construcciones, setConstrucciones] = useState<Construccion[]>([]);

  const handleEditar = () => {
    sessionStorage.setItem("relevamientoId", String(relevamientoId));
    router.push("/espacios-escolares"); // o la ruta que uses
  };

  const handleEditarConstruccion = () => {
    sessionStorage.setItem("relevamientoId", String(relevamientoId));
    router.push("/relevamiento-construcciones"); // o la ruta que uses
  }

  useEffect(() => {
    const fetchPredioYConstrucciones = async () => {
      try {
        const [predioData, construccionesData] = await Promise.all([
          predioService.getPredioByRelevamientoId(relevamientoId),
          fetch(`/api/construcciones?relevamiento_id=${relevamientoId}`).then(
            (res) => res.json()
          ),
        ]);

        if (predioData.length > 0) {
          setPredio(predioData[0]);
        } else {
          toast.info("No hay datos del predio para este relevamiento");
        }

        setConstrucciones(construccionesData || []);
      } catch (err) {
        toast.error("Error al cargar los datos del predio o construcciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPredioYConstrucciones();
  }, [relevamientoId]);

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
          {predio?.cantidad_construcciones}
        </p>
        <p>
          <strong>Superficie total:</strong> {predio?.superficie_total_predio}{" "}
          m²
        </p>
        {predio?.observaciones && (
          <ObservacionesDetailComponent observaciones={predio.observaciones} />
        )}
      </div>
      <div>
        <AreaExternaTable relevamientoId={relevamientoId} />
      </div>

      {(predio?.cantidad_construcciones ?? 0) > 0 && (
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
