/* eslint-disable @typescript-eslint/no-explicit-any */
// app/locales/[id]/LocalDetailForm.tsx
"use client";

import { useState } from "react";

export default function LocalDetailForm({ local }: { local: any }) {
  const [respuesta, setRespuesta] = useState("");
  const [inputExtra, setInputExtra] = useState("");

  const handleSave = () => {
    // Aquí iría la llamada al backend para guardar
  };

  return (
    <div className="border p-4 rounded shadow bg-white max-w-lg">
      {local.nombre_local === "Aula común" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">¿Tuvo este local un destino original, diferente al actual?</p>
          <div className="flex gap-4 items-center">
            <label>
              <input
                type="radio"
                value="No"
                checked={respuesta === "No"}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <span className="ml-1">No</span>
            </label>
            <label>
              <input
                type="radio"
                value="Sí"
                checked={respuesta === "Sí"}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <span className="ml-1">Sí</span>
            </label>
            {respuesta === "Sí" && (
              <input
                type="text"
                value={inputExtra}
                onChange={(e) => setInputExtra(e.target.value)}
                className="ml-4 border p-1 rounded text-sm"
                placeholder="Indique"
              />
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Guardar cambios
      </button>
    </div>
  );
}
