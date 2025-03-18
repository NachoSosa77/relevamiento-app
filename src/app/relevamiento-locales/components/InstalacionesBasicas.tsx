/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import { useState } from "react";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
}

interface EstructuraReuProps {
  id: number;
  sub_id: number;
  label: string;
  locales: Locales[];
}

export default function ServiciosBasicos({
  id,
  sub_id,
  label,
  locales,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string }>
  >({});
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(
    null
  );
  const [radioSeleccion, setRadioSeleccion] = useState<string | null>(null);

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
    setRadioSeleccion(value);
  };

  const handleOpcionChange = (value: string) => {
    setOpcionSeleccionada(value);
  };

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2">{sub_id}</th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Descripción</th>
            {sub_id !== 8.2 && <th className="border p-2">Funciona</th>}
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2">
                {showCondition && (
                  <Select
                    label=""
                    value={opcionSeleccionada || ""}
                    onChange={(e) => handleOpcionChange(e.target.value)}
                    options={opciones.map((option) => ({
                      value: option.id,
                      label: option.name,
                    }))}
                  />
                )}
              </td>
              {sub_id !== 8.2 && (
                <td className="border p-2 text-center">
                  <div className="flex gap-2 items-center justify-center">
                    <label>
                      <input
                        type="radio"
                        name={`estado-${id}`}
                        value="Regular"
                        onChange={() =>
                          handleResponseChange(id, "estado", "Regular")
                        }
                        className="mr-1"
                      />
                      Si
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`estado-${id}`}
                        value="Malo"
                        onChange={() =>
                          handleResponseChange(id, "estado", "Malo")
                        }
                        className="mr-1"
                      />
                      No
                    </label>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
