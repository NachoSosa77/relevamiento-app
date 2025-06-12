/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
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
    onUpdate?: () => void; // Esta función se llama cuando hay cambios

}

export default function TableReutilizable({
  id,
  label,
  locales,
  onUpdate
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();
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
          relevamiento_id: relevamientoId,
          local_id: localId,
        };
      })
      .filter(Boolean); // Filtra nulls

    // Validación mínima: al menos un material o estado debe tener valor
    const hayDatos = payload.some(
      (item) =>
        (item?.material && item.material.trim() !== "") ||
        (item?.estado && item.estado.trim() !== "")
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }

    try {
      const response = await fetch("/api/materiales_predominantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      toast.success("Información guardada correctamente");
          if (onUpdate) onUpdate(); // Notifica al padre que hubo cambio

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
        <div className="h-6 flex items-center justify-center text-white">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>
      <table className="w-full border text-xs">
        <thead>
          <tr className="bg-custom text-white">
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
                      className="mr-1 bg-custom"
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
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
