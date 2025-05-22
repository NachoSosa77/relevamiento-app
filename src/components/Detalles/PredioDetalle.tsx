/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion } from "@/interfaces/Locales";
import { predioService } from "@/services/Predio/predioService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AreaExternaTable } from "./AreaExternaTable";
import { ConstruccionDetalleAccordion } from "./ConstruccionDetalleAcordion";
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
  const [predio, setPredio] = useState<Predio | null>(null);
  const [construcciones, setConstrucciones] = useState<Construccion[]>([]);

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
      }
    };

    fetchPredioYConstrucciones();
  }, [relevamientoId]);

  if (!predio) return <div>No se encontró información del predio.</div>;

  return (
    <div className="space-y-4">
      <div className="border rounded p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">
          Información general del predio
        </h3>
        <p>
          <strong>Cantidad de construcciones:</strong>{" "}
          {predio.cantidad_construcciones}
        </p>
        <p>
          <strong>Superficie total:</strong> {predio.superficie_total_predio} m²
        </p>
        {predio.plano && (
          <p>
            <strong>Plano:</strong> {predio.plano}
          </p>
        )}
        {predio.observaciones && (
          <p>
            <strong>Observaciones:</strong> {predio.observaciones}
          </p>
        )}
      </div>
      <div>
        <AreaExternaTable relevamientoId={relevamientoId} />
      </div>

      {predio.cantidad_construcciones > 0 && (
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Construcciones relevadas</h3>
          {construcciones.length > 0 && (
            <div className="space-y-2">
              {construcciones.map((construccion, index) => (
                <ConstruccionDetalleAccordion
                  key={construccion.id}
                  construccion={construccion} // Podés pasarle la construcción entera si querés: construccion={construccion}
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
