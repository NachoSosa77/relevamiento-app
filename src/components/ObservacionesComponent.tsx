/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ObservacionesSkeleton from "./Skeleton/ObservacionesSkeleton";

interface ObservacionesComponentProps {
  onSave: (observations: string) => void;
  initialObservations?: string;
}

export default function ObservacionesComponent({
  onSave,
  initialObservations = "",
}: ObservacionesComponentProps) {
  const [observations, setObservations] = useState(initialObservations);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialObservations && initialObservations.trim() !== "") {
      toast.info("Observaciones cargadas correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [initialObservations]);

   useEffect(() => {
    if (initialObservations) {
      setLoading(true);
      setObservations(initialObservations); // 🔥 sincroniza con el valor de BD
      setLoading(false);
    }
  }, [initialObservations]);

  const handleSave = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(observations); // ⬅️ ahora esperamos por si `onSave` devuelve una promesa
      toast.success("Observaciones guardadas correctamente");
    } catch (error) {
      toast.error("Error al guardar observaciones");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    <ObservacionesSkeleton/>
  }

  return (
    <div className="mx-8 my-6 border rounded-2xl shadow-lg">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-700">OBSERVACIONES</p>
        </div>
        <textarea
          className="w-full h-32 mt-2 p-2 border resize-none"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          aria-label="Área de observaciones"
        />
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-custom text-sm text-white rounded-md hover:bg-custom/50 font-bold disabled:opacity-50"
            onClick={handleSave}
            disabled={!observations.trim() || isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
