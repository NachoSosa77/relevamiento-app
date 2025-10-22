// src/components/RelevamientoDetalle/RespondientesDetalle.tsx
"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { respondientesService } from "@/services/Respondientes/respondientesService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [respondientes, setRespondientes] = useState<Respondiente[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEditar = () => {
    dispatch(setRelevamientoId(relevamientoId));
    router.push("/relevamiento-predio");
  };

  useEffect(() => {
    const fetchRespondientes = async () => {
      try {
        const data = await respondientesService.getRespondientesPorRelevamiento(
          relevamientoId
        );
        setRespondientes(data);
      } catch {
        toast.error("Error al cargar respondientes");
      } finally {
        setLoading(false);
      }
    };

    fetchRespondientes();
  }, [relevamientoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleEditar}
          className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
        >
          Editar
        </button>
      </div>
      {respondientes.map((inst) => (
        <div key={inst.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <h4 className="text-lg font-semibold">{inst.nombre_completo}</h4>
          <p className="text-sm text-gray-600">
            Cargo: {inst.cargo} - Modalidad: {inst.establecimiento} | Telefono:{" "}
            {inst.telefono}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RespondientesDetalle;
