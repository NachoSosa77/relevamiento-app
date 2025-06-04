 
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

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  locales: Locales[];
}

export default function FormReutilizable({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; descripcion: string }>
  >({});
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(
    null
  );
  const [radioSeleccion, setRadioSeleccion] = useState<string | null>(null);

  const relevamientoId = useAppSelector(
      (state) => state.espacio_escolar.relevamientoId
    );

  const handleResponseChange = (
    localId: string,
    field: "disponibilidad" | "descripcion",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [localId]: { ...prev[localId], [field]: value },
    }));
    setRadioSeleccion(value);
  };

  const handleOpcionChange = (value: string) => {
    setOpcionSeleccionada(value);
  };

  const handleGuardar = async () => {
    const payload = {
      relevamiento_id: relevamientoId,
      locales: Object.keys(responses).map((key) => {
        const local = locales.find((local) => local.id === key);
        const opcion = local?.opciones.find(
          (opcion) => opcion.id.toString() === opcionSeleccionada
        );
  
        return {
          local: opcion?.name || "Unknown",
          disponibilidad: responses[key]?.disponibilidad || "",
          descripcion: responses[key]?.descripcion || "",
        };
      }),
    };
  
  
      /* try {
        const response = await fetch("/api/instalaciones_seguridad_incendio", {
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
  
        toast.success(
          "Relevamiento instalaciones de seguridad e incendio guardado correctamente"
        );
  
      } catch (error: any) {
        console.error("Error al enviar los datos:", error);
        toast.error(error.message || "Error al guardar los datos");
      } */
    };

  return (
    <div className="mx-10 text-sm">
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2 bg-black text-white">{id}</th>
            <th className="border p-2">{label}</th>
            <th className="border p-2"></th>
            {id !== 1 ? (
              <th className="border p-2">Descripción</th>
            ) : (
              <th className="border p-2">No</th>
            )}
            {id !== 13 && <th className="border p-2">Si</th>}
            <th className="border p-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2">
                {id === "1.1" && (
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
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "bg-slate-200 text-slate-400" : ""
                }`}
              >
                {!showCondition ? (
                  "No corresponde"
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
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "bg-slate-200 text-slate-400" : ""
                }`}
              >
                {!showCondition ? (
                  "No corresponde"
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
              <td className="border p-2 text-center">
                {opcionSeleccionada === "17" && id === "1.1" && (
                  <TextInput
                    label="Indique"
                    sublabel=""
                    value=""
                    onChange={(e) => {}}
                  />
                )}
                {radioSeleccion === "Si" && id === "1.2" && (
                  <TextInput
                    label="Indique"
                    sublabel=""
                    value=""
                    onChange={(e) => {}}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
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
