// src/components/RelevamientoDetalle/InstitucionesDetalle.tsx
"use client";

import { institucionesService } from "@/services/institucionesService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Institucion {
  id: number;
  nombre: string;
  cui: string;
  cue: string;
  modalidad_nivel: string;
  localidad: string;
}

interface Props {
  relevamientoId: number;
}

const InstitucionesDetalle = ({ relevamientoId }: Props) => {
  const router = useRouter();

  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEditar = (relevamientoId: number) => {
    sessionStorage.setItem("relevamientoId", String(relevamientoId));
    router.push("/espacios-escolares"); // o la ruta que uses
  };

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const data = await institucionesService.getInstitucionesPorRelevamiento(
          relevamientoId
        );
        setInstituciones(data);
      } catch {
        toast.error("Error al cargar instituciones");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituciones();
  }, [relevamientoId]);

  if (loading) return <p>Cargando instituciones...</p>;

  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => handleEditar(relevamientoId)}
          className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
        >
          Editar
        </button>
      </div>

      {instituciones.map((inst) => (
        <div key={inst.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <h4 className="text-lg font-semibold">{inst.nombre}</h4>
          <p className="text-sm text-gray-600">
            CUE: {inst.cue} - Cui: {inst.cui}
          </p>
          <p className="text-sm text-gray-600">
            Modalidad: {inst.modalidad_nivel} | Localidad: {inst.localidad}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InstitucionesDetalle;
