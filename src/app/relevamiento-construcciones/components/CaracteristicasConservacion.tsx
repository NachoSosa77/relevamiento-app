/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
//import { toast } from "react-toastify";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Estructura {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  estructuras: Estructura[];
}

export default function CaracteristicasConservacion({
  id,
  label,
  estructuras,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string }>
  >({});

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const handleGuardar = async () => {
    const payload = {
      relevamiento_id: relevamientoId,
      servicios: Object.keys(responses).map((key) => ({
        estructuras:
          estructuras.find((estructuras) => estructuras.id === key)?.opciones ||
          "Unknown",
        disponibilidad: responses[key]?.disponibilidad || "",
        estado: responses[key]?.estado || "", // nuevo campo
      })),
    };

    console.log("Datos a enviar:", payload);

    /* try {
            const response = await fetch("/api/estado_conservacion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            const result = await response.json();
        
            if (!response.ok) {
              throw new Error(result.error || "Error al guardar los datos");
            }
        
            toast.success("Relevamiento características constructivas y estado de conservación guardado correctamente");
        
            console.log("Respuesta de la API:", result);
          } catch (error: any) {
            console.error("Error al enviar los datos:", error);
            toast.error(error.message || "Error al guardar los datos");
          }   */
  };

  return (
    <div className="mx-10 text-sm">
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2 bg-black text-white">{id}</th>
            <th className="border p-2">{label}</th>
            {id !== 13 ? (
              <th className="border p-2">Descripción</th>
            ) : (
              <th className="border p-2">No</th>
            )}
            {id !== 13 ? (
              <th className="border p-2">Estado de conservación</th>
            ) : (
              <th className="border p-2">Si</th>
            )}
            {id === 13 && <th className="border p-2"></th>}
          </tr>
        </thead>
        <tbody>
          {estructuras.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2 text-center">
                {id !== "13.1" ? (
                  <Select
                    label=""
                    value={responses[id]?.disponibilidad || ""}
                    onChange={(e) => handleResponseChange(id, "disponibilidad", e.target.value)}
                    options={opciones.map((option) => ({
                      value: option.id,
                      label: `${option.prefijo} ${option.name}`,
                    }))}
                  />
                ) : (
                  <label>
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="No"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "No")
                      }
                    />
                  </label>
                )}
              </td>
              <td className="border p-2 text-center">
                {showCondition && id !== "13.1" ? (
                  <div className="flex gap-2 items-center justify-center">
                    <label>
                      <input
                        type="radio"
                        name={`estado-${id}`}
                        value="Bueno"
                        onChange={() =>
                          handleResponseChange(id, "estado", "Bueno")
                        }
                        className="mr-1"
                      />
                      B
                    </label>
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
                      R
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
                      M
                    </label>
                  </div>
                ) : (
                  <label>
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="Si"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "Si")
                      }
                    />
                  </label>
                )}
              </td>
              {!showCondition && (
                <td className="border p-2 text-center">
                  <TextInput
                    label="Indique cuales"
                    sublabel=""
                    value=""
                    onChange={(e) => {}}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
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
