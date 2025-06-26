"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ObservacionesComponentProps {
  onSave: (observations: string) => void;
  initialObservations?: string;
}

export default function ObservacionesComponent({
  onSave,
  initialObservations = "",
}: ObservacionesComponentProps) {
  const [observations, setObservations] = useState(initialObservations);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialObservations && initialObservations.trim() !== "") {
      toast.info("Observaciones cargadas correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [initialObservations]);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSave(observations);
    setIsSubmitting(false);
  };

  return (
    <div className="mx-10 my-6 border rounded-2xl shadow-lg">
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
            disabled={!observations.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
