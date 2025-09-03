"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableCantidadSkeleton from "./skeletons/TableCantidadSkeleton";

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
  onUpdate?: () => void;
}

interface RowData {
  abertura: string;
  tipo: string;
  cantidad: number;
  estado: string;
}

export default function TableCantidadReutilizable({
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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Traer info guardada al cargar
  useEffect(() => {
    if (!relevamientoId || locales.length === 0) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/aberturas?localId=${localId}&relevamientoId=${relevamientoId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          const newResponses: ResponseData = {};
          data.forEach((row: RowData) => {
            const local = locales.find((l) => l.question === row.abertura);
            if (!local) return;
            const key = local.id;
            newResponses[key] = newResponses[key] || {};
            newResponses[key][row.tipo] = {
              cantidad: row.cantidad,
              estado: row.estado,
            };
          });
          setResponses(newResponses);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error cargando datos existentes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId, locales]);

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
    const payload = locales.flatMap(({ id, question  }) => {
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

    const hayDatos = payload.some(
      (item) =>
        (item.estado && item.estado.trim() !== "") ||
        (item.cantidad !== undefined && item.cantidad !== null)
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch("/api/aberturas", {
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

  // 🔹 Skeleton mientras carga
  if (isLoading) return <TableCantidadSkeleton filas={locales.length || 3} />;

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

      {/* Tabla original */}
      <table className="w-full border text-xs">
        <thead>
          <tr className="bg-custom text-white">
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
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "bg-slate-200 text-slate-400" : ""
                }`}
              >
                {!showCondition
                  ? "No corresponde"
                  : opciones.map((tipo) => (
                      <span key={tipo} className="border p-1 block">
                        {tipo}
                      </span>
                    ))}
              </td>
              <td className="border p-2 text-center">
                {showCondition && opciones.length > 0
                  ? opciones.map((tipo) => (
                      <div key={tipo} className="flex flex-col mt-2">
                        <NumericInput
                          value={responses[id]?.[tipo]?.cantidad ?? 0}
                          onChange={(value) =>
                            handleResponseChange(id, tipo, "cantidad", value)
                          }
                        />
                      </div>
                    ))
                  : (
                      <NumericInput
                        value={responses[id]?.["default"]?.cantidad ?? undefined}
                        onChange={(value) =>
                          handleResponseChange(id, "default", "cantidad", value)
                        }
                      />
                    )}
              </td>
              {id !== "6.1" && id !== "6.2" && (
                <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0
                    ? opciones.map((tipo) => (
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
                    : ["Bueno", "Regular", "Malo"].map((estado) => (
                        <label key={estado} className="mr-2">
                          <input
                            type="radio"
                            name={`estado-${id}-default`}
                            value={estado}
                            checked={responses[id]?.["default"]?.estado === estado}
                            onChange={() =>
                              handleResponseChange(id, "default", "estado", estado)
                            }
                            className="mr-1"
                          />
                          {estado}
                        </label>
                      ))}
                </td>
              )}
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
