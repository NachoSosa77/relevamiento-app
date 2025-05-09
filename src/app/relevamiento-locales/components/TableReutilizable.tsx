/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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

export default function TableReutilizable({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const [responses, setResponses] = useState<
    Record<string, { material: string; estado: string }>
  >({});
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<
    Record<string, Opcion | null>
  >({});
  const [radioSeleccion, setRadioSeleccion] = useState<string | null>(null);

  const handleResponseChange = (
    servicioId: string,
    field: "material" | "estado",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
    setRadioSeleccion(value);
  };

  const handleOpcionChange = (itemId: string, opcion: Opcion) => {
    setMaterialesSeleccionados((prev) => ({
      ...prev,
      [itemId]: opcion,
    }));

    // Guardamos también en responses.material el nombre directamente
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        material: opcion.name,
      },
    }));
  };

  const handleGuardar = async () => {
    const payload = locales
      .map(({ id, question }) => {
        const respuesta = responses[id];
        if (!respuesta) return null;

        return {
          item: question,
          material: respuesta.material,
          estado: respuesta.estado,
          relevamiento_id: relevamientoId, // de Redux
          local_id: localId, // de URL
        };
      })
      .filter(Boolean); // filtra los nulls

    console.log("Datos a enviar:", payload);

    try {
      const response = await fetch("/api/materiales_predominantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      toast("Información guardada correctamente");
    } catch (error) {
      console.error(error);
      toast("Error al guardar los datos");
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
            <th className="border p-2">Material predominante</th>
            <th className="border p-2">Estado de conservación</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2">
                <Select
                  label=""
                  value={materialesSeleccionados[id]?.id.toString() || ""}
                  onChange={(e) => {
                    const opcion = opciones.find(
                      (opt) => opt.id.toString() === e.target.value
                    );
                    if (opcion) handleOpcionChange(id, opcion);
                  }}
                  options={opciones.map((option) => ({
                    value: option.id.toString(),
                    label: `${option.prefijo} - ${option.name}`,
                  }))}
                />
              </td>
              <td className="border p-2 text-center">
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
              </td>
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
