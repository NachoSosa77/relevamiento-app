/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Institucion } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ConstruccionInstitucionesProps {
  relevamientoId: number | undefined;
  construccionId: number | undefined;
}

const ConstruccionInstituciones: React.FC<ConstruccionInstitucionesProps> = ({
  relevamientoId,
  construccionId,
}) => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [selectedInstituciones, setSelectedInstituciones] = useState<number[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Traer instituciones relacionadas al relevamiento
  useEffect(() => {
    if (!relevamientoId) return;

    fetch(`/api/instituciones_por_relevamiento/${relevamientoId}`)
      .then((res) => res.json())
      .then((data: Institucion[]) => {
        setInstituciones(data);
      })
      .catch(() => {
        // manejar error
      });
  }, [relevamientoId]);

  // Traer instituciones relacionadas a la construcción
  useEffect(() => {
    if (!construccionId) return;

    fetch(
      `/api/instituciones_por_construccion?construccion_id=${construccionId}`
    )
      .then((res) => res.json())
      .then((data: { institucion_id: number }[]) => {
        setSelectedInstituciones(data.map((d) => d.institucion_id));
      })
      .catch(() => {
        // manejar error
      });
  }, [construccionId]);

  const toggleInstitucion = (id: number) => {
    setSelectedInstituciones((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleGuardar = async () => {
        if (isSubmitting) return; // previene doble click
    setIsSubmitting(true);

  if (!construccionId || !relevamientoId) return;
  setLoading(true);
  try {
    const res = await fetch(`/api/instituciones_por_construccion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        relevamiento_id: relevamientoId,
        construccion_id: construccionId,
        instituciones: selectedInstituciones,
      }),
    });
    if (res.ok) {
      toast.success("Instituciones asociadas correctamente");
    } else {
      toast.error("Error guardando asociaciones");
    }
  } catch (e) {
    toast.warn("Error de red guardando asociaciones");
  }finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
              <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>B</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">CUE-ANEXOS USUARIOS DE LA CONSTRUCCIÓN</p>
        </div>
        <div className="flex items-center p-1 border bg-gray-100 text-gray-400 text-xs">
          <p>
            Transcriba del Formulario 1 la denominación de los establecimientos educativos que funcionan en la construcción y el Número de CUE-Anexo de cada uno de ellos.
          </p>
        </div>
      </div>

      <h3 className="font-bold mb-2"></h3>
      {instituciones.length === 0 && (
        <p>No hay instituciones para este relevamiento.</p>
      )}
      <ul className="flex flex-col items-center justify-center max-h-60 overflow-y-auto">
        {instituciones.map((inst) => (
          <li key={inst.id}>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedInstituciones.includes(inst.id!)}
                onChange={() => toggleInstitucion(inst.id!)}
              />
              <span>{inst.nombre}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          disabled={loading}
          className="text-sm text-white font-bold bg-custom hover:bg-custom/50 p-2 rounded-lg flex-nowrap"
        >
          {loading ? "Guardando..." : "Guardar información"}
        </button>
      </div>
    </div>
  );
};

export default ConstruccionInstituciones;
