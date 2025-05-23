/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ResponseData {
  [id: string]: {
    disponibilidad?: string;
    superficieIluminacion?: number;
    superficieVentilacion?: number;
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

export default function IluminacionVentilacion({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const [responses, setResponses] = useState<ResponseData>({});

  const handleResponseChange = (
    id: string,
    field: "superficieIluminacion" | "superficieVentilacion" | "disponibilidad",
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
  const payload = locales.map(({ id, question }) => ({
    condicion: question,
    disponibilidad: responses[id]?.disponibilidad,
    superficie_iluminacion: responses[id]?.superficieIluminacion,
    superficie_ventilacion: responses[id]?.superficieVentilacion,
    relevamiento_id: relevamientoId,
    local_id: localId,
  }));

  // Validación mínima: al menos un campo con datos
  const hayDatos = payload.some(
    (item) =>
      (item.disponibilidad && item.disponibilidad.trim() !== "") 
  );

  if (!hayDatos) {
    toast.warning("Por favor, completá al menos un dato antes de guardar.");
    return;
  }


  try {
    const response = await fetch("/api/iluminacion_ventilacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    toast.success("Información guardada correctamente");
  } catch (error) {
    console.error(error);
    toast.error("Error al guardar los datos");
  }
};


  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
        <div className="w-6 h-6 rounded-full flex justify-center items-center text-custom bg-white">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>
      <table className="w-full border text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Si</th>
            <th className="border p-2">No</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2 text-center">{question}</td>
              <td className="border p-2 text-center">
                {showCondition ? (
                  <label>
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      checked={responses[id]?.disponibilidad === "Si"}
                      value="Si"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "Si")
                      }
                      className="mr-1"
                    />
                    Si
                  </label>
                ) : (
                  <DecimalNumericInput
                    disabled={false}
                    label={"Superficie de iluminación"}
                    subLabel="m2"
                    value={responses[id]?.superficieIluminacion ?? 0}
                    onChange={(value) =>
                      handleResponseChange(id, "superficieIluminacion", value)
                    }
                  />
                )}
              </td>
              <td className="border p-2 text-center">
                {showCondition ? (
                  <label>
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="No"
                      checked={responses[id]?.disponibilidad === "No"}
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "No")
                      }
                      className="mr-1"
                    />
                    No
                  </label>
                ) : (
                  <DecimalNumericInput
                    disabled={false}
                    label="Superficie de ventilación"
                    subLabel="m2"
                    value={responses[id]?.superficieVentilacion ?? 0}
                    onChange={(value) =>
                      handleResponseChange(id, "superficieVentilacion", value)
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
