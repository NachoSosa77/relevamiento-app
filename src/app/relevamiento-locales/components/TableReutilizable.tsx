"use client";

import Select from "@/components/ui/SelectComponent";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableReutilizableSkeleton from "./TableReutilizableSkeleton";

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
  onUpdate?: () => void;
}

interface MaterialRow {
  item: string;
  material: string;
  estado: string | null;
}

export default function TableReutilizable({
  id,
  label,
  locales,
  onUpdate,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<
    Record<string, { material: string; estado: string | null }>
  >({});
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<
    Record<string, Opcion | null>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (!relevamientoId || isNaN(localId)) return;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/materiales_predominantes?localId=${localId}&relevamientoId=${relevamientoId}`
      );
      if (!res.ok) throw new Error("Error al cargar materiales");

      const data = await res.json();
      if (data.length > 0) {
        setIsEditing(true);

        const newResponses: Record<string, { material: string; estado: string | null }> = {};
        const newMateriales: Record<string, Opcion | null> = {};

        data.forEach((row: MaterialRow) => {
          const local = locales.find((l) => l.question === row.item);
          if (!local) return;
          const key = local.id;

          newResponses[key] = { material: row.material, estado: row.estado };
          newMateriales[key] =
            local.opciones.find(
              (opt) => opt.name.toLowerCase() === row.material?.toLowerCase()
            ) || null;
        });

        setResponses(newResponses);
        setMaterialesSeleccionados(newMateriales);
      }
    } catch (err) {
      console.error("Error cargando materiales existentes:", err);
      toast.error("Error al cargar materiales");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [localId, relevamientoId, locales]);

  const handleResponseChange = (
    servicioId: string,
    field: "material" | "estado",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleOpcionChange = (itemId: string, opcion: Opcion) => {
    setMaterialesSeleccionados((prev) => ({ ...prev, [itemId]: opcion }));

    setResponses((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], material: opcion.name },
    }));
  };

  const handleGuardar = async () => {
    const payload = locales
      .map(({ id, question }) => {
        const respuesta = responses[id];
        if (!respuesta) return null;

        return {
          item: question,
          material: respuesta.material ?? null,
          estado: respuesta.estado ?? null,
          relevamiento_id: relevamientoId,
          local_id: localId,
        };
      })
      .filter(Boolean);

    const hayDatos = payload.some(
      (item) =>
        (item?.material && item.material.trim() !== "") ||
        (item?.estado && item.estado.trim() !== "")
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/materiales_predominantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(
          isEditing
            ? "Información actualizada correctamente"
            : "Información guardada correctamente"
        );
        if (onUpdate) onUpdate();
      } else {
        toast.error("Error al guardar los datos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los datos");
    }
    setIsSubmitting(false);
  };

if (isLoading) {
  return <TableReutilizableSkeleton filas={locales.length || 3} />;
}

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
        {isEditing && (
          <div className="bg-yellow-100 text-yellow-700 p-2 mb-2 rounded-md text-xs">
            ⚠️ Estás viendo datos ya guardados. Podés editarlos y volver a
            guardar.
          </div>
        )}
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
          {locales.map(({ id, question, opciones }) => (
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
                      {estado.charAt(0)}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
            ? "Actualizar Información"
            : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
