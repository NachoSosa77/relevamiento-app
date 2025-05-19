/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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

  useEffect(() => {
    const fetchPredio = async () => {
      try {
        const data = await predioService.getPredioByRelevamientoId(
          relevamientoId
        );
        if (data.length > 0) {
          setPredio(data[0]);
        } else {
          toast.info("No hay datos del predio para este relevamiento");
        }
      } catch (err) {
        toast.error("Error al cargar los datos del predio");
      }
    };

    fetchPredio();
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
          <h3 className="text-md font-semibold">Construcciones registradas</h3>
          {Array.from({ length: predio.cantidad_construcciones }).map(
            (_, index) => (
              <ConstruccionDetalleAccordion
                key={index}
                relevamientoId={relevamientoId}
                numeroConstruccion={index + 1}
              />
            )
          )}
        </div>
      )}

      <ServiciosBasicosTable relevamientoId={relevamientoId} />
    </div>
  );
};
