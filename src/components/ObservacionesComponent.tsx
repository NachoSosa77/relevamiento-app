"use client";

import { useState } from "react";

interface ObservacionesComponentProps {
  onSave: (observations: string, contextId: string | number) => void;
  initialObservations?: string;
  contextId: string | number;
}

export default function ObservacionesComponent({
  onSave,
  initialObservations = "",
  contextId,
}: ObservacionesComponentProps) {
  const [observations, setObservations] = useState(initialObservations);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await onSave(observations, contextId);
      setMessage("Observación guardada con éxito.");
    } catch (error) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <p className="px-2 text-sm font-bold">OBSERVACIONES</p>
      </div>
      <textarea
        className="w-full h-32 mt-2 p-2 border resize-none"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {message && <p className="mt-2 text-center text-gray-600">{message}</p>}
    </div>
  );
}
