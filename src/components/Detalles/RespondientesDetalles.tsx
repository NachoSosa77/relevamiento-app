// src/components/RelevamientoDetalle/RespondientesDetalle.tsx
"use client";

import { respondientesService } from "@/services/Respondientes/respondientesService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Respondiente {
  id: number;
  nombre_completo: string;
  establecimiento: string;
  cargo: string;
  telefono: string;
}

interface Props {
  relevamientoId: number;
}

const RespondientesDetalle = ({ relevamientoId }: Props) => {
  const [respondientes, setRespondientes] = useState<Respondiente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRespondientes = async () => {
      try {
        const data = await respondientesService.getRespondientesPorRelevamiento(relevamientoId);
        setRespondientes(data);
      } catch {
        toast.error("Error al cargar respondientes");
      } finally {
        setLoading(false);
      }
    };

    fetchRespondientes();
  }, [relevamientoId]);

  if (loading) return <p>Cargando respondientes...</p>;

  return (
    <div className="space-y-3">
      {respondientes.map((inst) => (
        <div
          key={inst.id}
          className="border p-4 rounded-lg shadow-sm bg-white"
        >
          <h4 className="text-lg font-semibold">{inst.nombre_completo}</h4>
          <p className="text-sm text-gray-600">
            Cargo: {inst.cargo} - Modalidad: {inst.establecimiento} | Telefono: {inst.telefono}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RespondientesDetalle;
