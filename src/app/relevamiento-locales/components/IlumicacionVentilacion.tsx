"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InterfaceIluminacionVentilacion } from "@/interfaces/InterfaceIluminacionVentilacion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import IluminacionVentilacionSkeleton from "./skeletons/IluminacionVentilacionSkeleton";

interface ResponseData {
  [id: string]: {
    id?: number; // 🔹 este es el id de la fila en la base
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
  onUpdate?: () => void;
}

export default function IluminacionVentilacion({
  id,
  label,
  locales,
  onUpdate,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();
  const [responses, setResponses] = useState<ResponseData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // extraer fetchData a función externa del useEffect
  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/iluminacion_ventilacion?localId=${localId}&relevamientoId=${relevamientoId}`
      );
      if (!res.ok) return;
      const data = await res.json();

      if (data.length > 0) {
        const newResponses: ResponseData = {};
        data.forEach((item: InterfaceIluminacionVentilacion) => {
          const local = locales.find((l) => l.question === item.condicion);
          if (!local) return;
          newResponses[local.id] = {
            id: item.id, // 🔹 importante para PATCH
            disponibilidad: item.disponibilidad ?? undefined,
            superficieIluminacion: item.superficie_iluminacion
              ? Number(item.superficie_iluminacion)
              : undefined,
            superficieVentilacion: item.superficie_ventilacion
              ? Number(item.superficie_ventilacion)
              : undefined,
          };
        });
        setResponses(newResponses);
        setIsEditing(data.length > 0); // modo edición
      } else {
        setResponses({});
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error cargando iluminación y ventilación:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // correr solo una vez al montar
  useEffect(() => {
    if (!relevamientoId || isNaN(localId)) return;
    setIsLoading(true);
    fetchData();
  }, [localId, relevamientoId, locales]);

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
  if (!relevamientoId || !localId) return;

  setIsSubmitting(true);

  try {
    for (const { id, question } of locales) {
      const resp = responses[id];
      if (!resp) continue;

      const payload = {
        id: resp.id ?? null, // si existe, vamos a PATCH
        condicion: question,
        disponibilidad: resp.disponibilidad ?? null,
        superficie_iluminacion: resp.superficieIluminacion ?? null,
        superficie_ventilacion: resp.superficieVentilacion ?? null,
        relevamiento_id: relevamientoId,
        local_id: localId,
      };

      if (resp.id) {
        // 🔹 Actualizamos registro existente
        await fetch("/api/iluminacion_ventilacion", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // 🔹 Insertamos nuevo registro
        await fetch("/api/iluminacion_ventilacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([payload]), // POST espera un array
        });
      }
    }

    toast.success("Información guardada correctamente");
    fetchData();
    onUpdate?.();
  } catch (err) {
    console.error(err);
    toast.error("Error al guardar los datos");
  } finally {
    setIsSubmitting(false);
  }
};



  if (isLoading) return <IluminacionVentilacionSkeleton />;

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
