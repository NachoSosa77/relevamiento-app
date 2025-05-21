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
      estado: string;
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

export default function TableCantidadReutilizable({
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
    tipo: string,
    field: "cantidad" | "estado",
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
      abertura: question,
      tipo,
      estado: valores.estado,
      cantidad: valores.cantidad,
      relevamiento_id: relevamientoId,
      local_id: localId,
    }));
  });

  // Validación mínima: al menos un estado o cantidad debe estar presente
  const hayDatos = payload.some(
    (item) =>
      (item.estado && item.estado.trim() !== "") ||
      (item.cantidad !== undefined && item.cantidad !== null)
  );

  if (!hayDatos) {
    toast.warning("Por favor, completá al menos un dato antes de guardar.");
    return;
  }


  try {
    const response = await fetch("/api/aberturas", {
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
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            {id !== 6 && <th className="border p-2">Estado</th>}
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
              <tr key={id} className="border">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2 text-center">{question}</td>
                <td className={` "border p-2 text-center ${!showCondition? "bg-slate-200 text-slate-400" : ""}`}>
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex flex-col text-sm">
                      {opciones.map((tipo) => (
                        <span key={tipo} className="border p-1">
                          {tipo}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0 ? (
                    opciones.map((tipo) => (
                      <div key={tipo} className="flex flex-col mt-2">
                      <NumericInput
                        disabled={false}
                        label=""
                        subLabel=""
                        value={responses[id]?.[tipo]?.cantidad ?? 0}
                        onChange={(value) =>
                          handleResponseChange(id, tipo, "cantidad", value)
                        }
                      />
                      </div>
                    ))
                  ) : (
                    <NumericInput
                      disabled={false}
                      label=""
                      subLabel=""
                      value={responses[id]?.["default"]?.cantidad ?? undefined}
                      onChange={(value) =>
                        handleResponseChange(id, "default", "cantidad", value)
                      }
                    />
                  )}
                </td>
               { id !== "6.1" && id !== "6.2" && <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0 ? (
                    opciones.map((tipo) => (
                      <div
                        key={tipo}
                        className="flex gap-2 items-center justify-center"
                      >
                        {["Bueno", "Regular", "Malo"].map((estado) => (
                          <label key={estado}>
                            <input
                              type="radio"
                              name={`estado-${id}-${tipo}`}
                              value={estado}
                              checked={responses[id]?.[tipo]?.estado === estado}
                              onChange={() =>
                                handleResponseChange(id, tipo, "estado", estado)
                              }
                              className="mr-1 mt-4"
                            />
                            {estado}
                          </label>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      {["Bueno", "Regular", "Malo"].map((estado) => (
                        <label key={estado}>
                          <input
                            type="radio"
                            name={`estado-${id}-default`}
                            value={estado}
                            checked={
                              responses[id]?.["default"]?.estado === estado
                            }
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "default",
                                "estado",
                                estado
                              )
                            }
                            className="mr-1"
                          />
                          {estado}
                        </label>
                      ))}
                    </div>
                  )}
                </td>}
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
