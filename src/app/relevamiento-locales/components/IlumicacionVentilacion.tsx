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

  // 🔹 Cargar datos existentes
 useEffect(() => {
      if (!relevamientoId || isNaN(localId)) return;

  let isMounted = true;

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/iluminacion_ventilacion?localId=${localId}&relevamientoId=${relevamientoId}`);
      if (!res.ok) return;
      const data = await res.json();

      if (isMounted && data.length > 0) {
        const newResponses: ResponseData = {};

        data.forEach((item: InterfaceIluminacionVentilacion) => {
          // Buscar local correspondiente por condicion
          const local = locales.find((l) => l.question === item.condicion);
          if (!local) return;
          const key = local.id; // usamos id de locales
          newResponses[key] = {
            disponibilidad: item.disponibilidad ?? undefined,
            superficieIluminacion: item.superficie_iluminacion ? Number(item.superficie_iluminacion) : 0,
            superficieVentilacion: item.superficie_ventilacion ? Number(item.superficie_ventilacion) : 0,
          };
        });

        setResponses(newResponses);
         setIsEditing(true); // activamos modo edición si hay datos
      }
    } catch (err) {
      console.error("Error cargando iluminación y ventilación:", err);
    }
    finally {
  if (isMounted) setIsLoading(false);
}
  };

  fetchData();
  return () => {
    isMounted = false;
  };
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
    const payload = locales.map(({ id, question }) => ({
      condicion: question,
      disponibilidad: responses[id]?.disponibilidad,
      superficie_iluminacion: responses[id]?.superficieIluminacion,
      superficie_ventilacion: responses[id]?.superficieVentilacion,
      relevamiento_id: relevamientoId,
      local_id: localId,
    }));

    const hayDatos = payload.some(
      (item) =>
        item.disponibilidad ||
        item.superficie_iluminacion ||
        item.superficie_ventilacion
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await fetch("/api/iluminacion_ventilacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success(
        isEditing
          ? "Información actualizada correctamente"
          : "Información guardada correctamente"
      );
      onUpdate?.();
    } catch (error) {
      console.error(error);
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
          ⚠️ Estás viendo datos ya guardados. Podés editarlos y volver a guardar.
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
          {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Información" : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
