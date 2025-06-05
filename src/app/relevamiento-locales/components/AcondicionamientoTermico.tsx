/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ResponseData {
  [id: string]: {
    [tipo: string]: {
      cantidad: number;
      disponibilidad?: string;
    };
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

export default function AcondicionamientoTermico({
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

  const tiposConDisponibilidad = [
    "Aire acondicionado central",
    "Calefacción central",
    "Calefacción a gas"

  ];

  const handleResponseChange = (
    id: string,
    tipo: string,
    field: "cantidad" | "disponibilidad",
    value: number | string | undefined
  ) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [tipo]: { ...prev[id]?.[tipo], [field]: value },
      },
    }));
  };

  const handleGuardar = async () => {
  const payload = locales.flatMap(({ id, question }) => {
    const respuesta = responses[id];
    if (!respuesta) return [];

    return Object.entries(respuesta).map(([tipo, valores]) => ({
      temperatura: question,
      tipo,
      cantidad: valores.cantidad,
      disponibilidad: valores.disponibilidad ?? null,
      relevamiento_id: relevamientoId,
      local_id: localId,
    }));
  });

  // Validación mínima: al menos una entrada con cantidad o disponibilidad
  const hayDatos = payload.some(
    (item) =>
      (item.cantidad !== undefined && item.cantidad !== null) ||
      (item.disponibilidad !== undefined && item.disponibilidad !== null && item.disponibilidad !== "")
  );

  if (!hayDatos) {
    toast.warning("Por favor, completá al menos un dato antes de guardar.");
    return;
  }

  try {
    const response = await fetch("/api/acondicionamiento_termico", {
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
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {locales.map((local) => {
            const { id, question, showCondition, opciones } = local;
            return (
              <tr key={id} className="border">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2 text-center">{question}</td>
                <td
                  className={`border p-2 text-center ${
                    !showCondition ? "bg-slate-200 text-slate-400" : ""
                  }`}
                >
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex flex-col text-sm">
                      {opciones.map((tipo) => {
                        return (
                          <span key={tipo} className="border p-1 rounded mt-2">
                            {tipo}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0 ? (
                    opciones.map((tipo) => {
                      const esNoTiene = tipo.toLowerCase().includes("no tiene");
                      return (
                        <div key={tipo} className="flex flex-col mt-2">
                          {esNoTiene ? (
                            <div className="bg-slate-200 text-slate-500 text-center p-2 rounded">
                              No corresponde
                            </div>
                          ) : tiposConDisponibilidad.includes(tipo) ? (
                            <div className="flex gap-2 items-center justify-center border rounded p-2">
                              {["Si", "No"].map((opcion) => (
                                <div key={opcion}>
                                  <input
                                    type="radio"
                                    name={`disponibilidad-${id}-${tipo}`}
                                    value={opcion}
                                    checked={
                                      responses[id]?.[tipo]?.disponibilidad ===
                                      opcion
                                    }
                                    onChange={() =>
                                      handleResponseChange(
                                        id,
                                        tipo,
                                        "disponibilidad",
                                        opcion
                                      )
                                    }
                                    className="mr-1"
                                  />
                                  {opcion}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <NumericInput
                              disabled={false}
                              label=""
                              subLabel=""
                              value={responses[id]?.[tipo]?.cantidad ?? 0}
                              onChange={(value) =>
                                handleResponseChange(
                                  id,
                                  tipo,
                                  "cantidad",
                                  value
                                )
                              }
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    
                    <NumericInput
                      disabled={false}
                      label=""
                      subLabel=""
                      value={responses[id]?.["default"]?.cantidad ?? 0}
                      onChange={(value) =>
                        handleResponseChange(id, "default", "cantidad", value)
                      }
                    />
                  )}
                </td>
              </tr>
            );
          })}
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
