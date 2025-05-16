/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { construccionService } from "@/services/Construcciones/construccionesService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  numeroConstruccion: number;
  relevamientoId: number;
}

interface Construccion {
  id: number;
  superficie_cubierta: string;
  superficie_semicubierta: string;
  superficie_total:string;
  antiguedad?: string;
  destino:string;
  observaciones?: string;
}

export const ConstruccionDetalle = ({
  numeroConstruccion,
  relevamientoId,
}: Props) => {
  const [construccion, setConstruccion] = useState<Construccion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await construccionService.getConstruccionByNumero(
          relevamientoId,
          numeroConstruccion
        );
        setConstruccion(data);
      } catch (error) {
        toast.error("Error al cargar la construcción");
      }
    };

    fetchData();
  }, [relevamientoId, numeroConstruccion]);
  if (!construccion)
    return (
      <p className="text-sm text-gray-500">
        Cargando construcción #{numeroConstruccion}...
      </p>
    );

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h4 className="text-md font-bold text-blue-800 mb-2">
        Construcción #{numeroConstruccion}
      </h4>
      <p>
        <strong>Superficie Total:</strong> {construccion.superficie_total} m²
      </p>
      {construccion.observaciones && (
        <p>
          <strong>Observaciones:</strong> {construccion.observaciones}
        </p>
      )}
    </div>
  );
};
