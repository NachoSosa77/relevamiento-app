"use client";




import { useState } from "react";

interface ObservacionesComponentProps {
  onSave: (observations: string) => void; // Cambiar onSave a una función de callback
  initialObservations?: string;
}

export default function ObservacionesComponent({
  onSave,
  initialObservations = "",
}: ObservacionesComponentProps) {
  const [observations, setObservations] = useState(initialObservations);

  const handleSave = async () => {
    onSave(observations); // Llama a la función de callback del padre
  };

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <p className="px-2 text-sm font-bold">OBSERVACIONES</p>
      </div>
      <textarea
        className="w-full h-32 mt-2 p-2 border resize-none"
        value={observations}
        onChange={(e) => {
          setObservations(e.target.value);
        }}
        aria-label="Área de observaciones"
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400 disabled:opacity-50"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
