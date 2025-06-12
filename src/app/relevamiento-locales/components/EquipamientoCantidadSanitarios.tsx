/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ResponseData {
  [id: string]: {
    cantidad: number;
    cantidad_funcionamiento: number;
    estado: string;
  };
}

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: string[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  locales: Locales[];
}

export default function EquipamientoCantidadSanitarios({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<ResponseData>({});

  const handleResponseChange = (
    id: string,
    field: keyof ResponseData[string],
    value: number | string | undefined
  ) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleGuardar = async () => {
    const payload = locales.map(({ id, question }) => {
      const respuesta = responses[id];

      return {
        equipamiento: question,
        cantidad: respuesta?.cantidad,
        cantidad_funcionamiento: respuesta?.cantidad_funcionamiento,
        estado: respuesta?.estado,
        relevamiento_id: relevamientoId,
        local_id: localId,
      };
    });

    // Filtrar solo los que tengan cantidad > 0
    const datosFiltrados = payload.filter(
      (item) => typeof item.cantidad === "number" && item.cantidad > 0
    );

    if (datosFiltrados.length === 0) {
      toast.warning("Debe completar al menos un dato para guardar.");
      return;
    }
    try {
      const response = await fetch("/api/equipamiento_sanitarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFiltrados),
      });
      toast.success("Información guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los datos");
    }
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
            <th className="border p-2"></th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Cantidad en funcionamiento</th>
            {id === 10 && <th className="border p-2">Estado</th>}
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2 text-center">{question}</td>
              <td className="border p-2 text-center">
                <NumericInput
                  disabled={false}
                  label=""
                  subLabel=""
                  value={responses[id]?.cantidad || 0}
                  onChange={(value) =>
                    handleResponseChange(id, "cantidad", value)
                  }
                />
              </td>
              <td className="border p-2 text-center">
                <NumericInput
                  disabled={false}
                  label=""
                  subLabel=""
                  value={responses[id]?.cantidad_funcionamiento || 0}
                  onChange={(value) =>
                    handleResponseChange(id, "cantidad_funcionamiento", value)
                  }
                />
              </td>
              {showCondition && (
                <td className="border p-2 text-center">
                  <div className="flex gap-2 items-center justify-center">
                    {["Bueno", "Regular", "Malo"].map((estado) => (
                      <label key={estado}>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value={estado}
                          checked={responses[id]?.estado === estado}
                          onChange={() =>
                            handleResponseChange(id, "estado", estado)
                          }
                          className="mr-1"
                        />
                        {estado}
                      </label>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
