"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { AcondicionamientoTermicoItem } from "@/interfaces/Acondicionamiento";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AcondicionamientoTermicoSkeleton from "./skeletons/AcondicionamientoTermicoSkeleton";

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
  onUpdate?: () => void;
}

export default function AcondicionamientoTermico({
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

  const tiposConDisponibilidad = ["Aire acondicionado central", "Calefacción central"];

  // 🔹 Cargar datos existentes
  useEffect(() => {
    if (!relevamientoId || isNaN(localId)) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/acondicionamiento_termico?localId=${localId}&relevamientoId=${relevamientoId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (isMounted && data.length > 0) {
          const newResponses: ResponseData = {};

          data.forEach((item: AcondicionamientoTermicoItem) => {
            const local = locales.find((l) => l.question === item.temperatura);
            if (!local) return;
            const key = String(local.id);
            if (!newResponses[key]) newResponses[key] = {};
            newResponses[key][item.tipo] = {
              cantidad: item.cantidad ?? 0,
              disponibilidad: item.disponibilidad ?? undefined,
            };
          });

          setResponses(newResponses);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error cargando acondicionamiento térmico:", err);
      } finally {
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

    const hayDatos = payload.some(
      (item) =>
        (item.cantidad !== undefined && item.cantidad !== null) ||
        (item.disponibilidad !== undefined &&
          item.disponibilidad !== null &&
          item.disponibilidad !== "")
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch("/api/acondicionamiento_termico", {
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

  if (isLoading) return <AcondicionamientoTermicoSkeleton />;

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
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {locales.map((local) => {
            const { id, question, showCondition, opciones } = local;
            const key = String(id);

            return (
              <tr key={id} className="border">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2 text-center">{question}</td>
                <td className={`border p-2 text-center ${!showCondition ? "bg-slate-200 text-slate-400" : ""}`}>
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex flex-col text-sm">
                      {opciones.map((tipo) => (
                        <span key={tipo} className="border p-1 rounded mt-2">{tipo}</span>
                      ))}
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
                            <div className="bg-slate-200 text-slate-500 text-center p-2 rounded">No corresponde</div>
                          ) : tiposConDisponibilidad.includes(tipo) ? (
                            <div className="flex gap-2 items-center justify-center border rounded p-2">
                              {["Si", "No"].map((opcion) => (
                                <div key={opcion}>
                                  <input
                                    type="radio"
                                    name={`disponibilidad-${id}-${tipo}`}
                                    value={opcion}
                                    checked={responses[key]?.[tipo]?.disponibilidad === opcion}
                                    onChange={() =>
                                      handleResponseChange(key, tipo, "disponibilidad", opcion)
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
                              value={responses[key]?.[tipo]?.cantidad ?? 0}
                              onChange={(value) => handleResponseChange(key, tipo, "cantidad", value)}
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
                      value={responses[key]?.["default"]?.cantidad ?? 0}
                      onChange={(value) => handleResponseChange(key, "default", "cantidad", value)}
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
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Información" : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
