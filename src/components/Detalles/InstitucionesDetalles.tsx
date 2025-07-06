"use client";

import Spinner from "@/components/ui/Spinner"; // ✅ importación
import { institucionesService } from "@/services/institucionesService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Institucion {
  id: number;
  institucion: string;
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

  const handleEditar = () => {
    sessionStorage.setItem("relevamientoId", String(relevamientoId));
    router.push("/espacios-escolares");
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

      {instituciones.map((inst) => (
        <div key={inst.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <h4 className="text-lg font-semibold">{inst.institucion}</h4>
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
