/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Servicio {
  id: string;
  question: string;
  showCondition: boolean;
}

interface ServiciosReuProps {
  id: number;
  label: string;
  sub_id: number;
  sublabel: string;
  servicios: Servicio[];
  construccionId: number | null;
}

interface RespuestaAccesibilidad {
  id?: number;
  disponibilidad: string;
  estado: string;
  cantidad: number;
  mantenimiento: string;
}

// --- helpers ---
const normalizeText = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .trim()
    .toLowerCase();

export default function CondicionesAccesibilidad({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<
    Record<string, RespuestaAccesibilidad>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);

  // Mapa question normalizada -> id ("8.x")
  const questionToId = useMemo(() => {
    const map = new Map<string, string>();
    servicios.forEach((s) => map.set(normalizeText(s.question || ""), s.id));
    return map;
  }, [servicios]);

  // Guarda el texto exacto de "servicio" que viene de DB por cada key ("8.x")
  const dbServiceTextByKeyRef = useRef<Record<string, string>>({});

  // Cargar datos existentes para editar
  useEffect(() => {
    if (!relevamientoId || !construccionId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/condiciones_accesibilidad?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );

        if (!res.ok) {
          setResponses({});
          setEditando(false);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, RespuestaAccesibilidad> = {};
          const dbMap: Record<string, string> = {};

          for (const row of data) {
            const key = questionToId.get(normalizeText(row.servicio || ""));
            if (!key) continue;

            next[key] = {
              id: row.id,
              disponibilidad: row.disponibilidad ?? "",
              estado: row.estado ?? "",
              cantidad: Number(row.cantidad ?? 0),
              mantenimiento: row.mantenimiento ?? "",
            };
            dbMap[key] = row.servicio || "";
          }

          setResponses(next);
          dbServiceTextByKeyRef.current = dbMap;
          setEditando(Object.keys(next).length > 0);
        } else {
          setResponses({});
          dbServiceTextByKeyRef.current = {};
          setEditando(false);
        }
      } catch (error) {
        console.error("Error al cargar condiciones accesibilidad:", error);
        setResponses({});
        dbServiceTextByKeyRef.current = {};
        setEditando(false);
      }
    };

    fetchData();
  }, [relevamientoId, construccionId, questionToId]);

  const handleResponseChange = (
    servicioId: string,
    field: keyof RespuestaAccesibilidad,
    value: string | number
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value as any },
    }));
  };

  const handleGuardar = async () => {
    // Validar que haya al menos un servicio con datos válidos
    const serviciosValidos = Object.keys(responses).filter((key) => {
      const r = responses[key];
      return (
        (r?.disponibilidad?.trim?.() || "") !== "" ||
        (r?.estado?.trim?.() || "") !== "" ||
        (r?.mantenimiento?.trim?.() || "") !== "" ||
        Number(r?.cantidad || 0) > 0
      );
    });

    if (serviciosValidos.length === 0) {
      toast.warning(
        "Debe completar al menos un servicio con datos antes de guardar"
      );
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: serviciosValidos.map((key) => ({
        id: responses[key].id, // si existe, PATCH lo usará
        servicio:
          dbServiceTextByKeyRef.current[key] ||
          (servicios.find((s) => s.id === key)?.question ?? "Unknown"),
        disponibilidad: responses[key].disponibilidad || "",
        estado: responses[key].estado || "",
        cantidad: Number(responses[key].cantidad || 0),
        mantenimiento: responses[key].mantenimiento || "",
      })),
    };

    setIsSubmitting(true);
    try {
      const resp = await fetch("/api/condiciones_accesibilidad", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();
      if (!resp.ok)
        throw new Error(result?.error || "Error al guardar los datos");

      toast.success(
        editando
          ? "Datos de condiciones accesibilidad actualizados correctamente"
          : "Datos de condiciones accesibilidad guardados correctamente"
      );

      // 🔁 Refrescar desde DB para mostrar lo persistido y activar banner
      const refresco = await fetch(
        `/api/condiciones_accesibilidad?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );
      if (refresco.ok) {
        const data = await refresco.json();
        const next: Record<string, RespuestaAccesibilidad> = {};
        const dbMap: Record<string, string> = {};

        for (const row of data) {
          const key = questionToId.get(normalizeText(row.servicio || ""));
          if (!key) continue;
          next[key] = {
            id: row.id,
            disponibilidad: row.disponibilidad ?? "",
            estado: row.estado ?? "",
            cantidad: Number(row.cantidad ?? 0),
            mantenimiento: row.mantenimiento ?? "",
          };
          dbMap[key] = row.servicio || "";
        }

        setResponses(next);
        dbServiceTextByKeyRef.current = dbMap;
        setEditando(Object.keys(next).length > 0);
      }
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      toast.error(error.message || "Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}
      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}
      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-6 h-6 flex justify-center text-black font-bold">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
      )}

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2">TIPO DE PROVISIÓN</th>
            <th className="border p-2">No</th>
            <th className="border p-2">Sí</th>
            <th className="border p-2">Estado y especificaciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => {
            const r = responses[id] || {
              disponibilidad: "",
              estado: "",
              cantidad: 0,
              mantenimiento: "",
            };
            return (
              <tr key={id} className="border text-sm">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2">{question}</td>
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="No"
                    checked={r.disponibilidad === "No"}
                    onChange={() =>
                      handleResponseChange(id, "disponibilidad", "No")
                    }
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="Si"
                    checked={r.disponibilidad === "Si"}
                    onChange={() =>
                      handleResponseChange(id, "disponibilidad", "Si")
                    }
                  />
                </td>

                <td
                  className={`border p-2 text-center ${
                    !showCondition ? "bg-slate-200 text-slate-400" : ""
                  }`}
                >
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <div className="flex gap-2 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`estado-${id}`}
                            value="Bueno"
                            checked={r.estado === "Bueno"}
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
                            checked={r.estado === "Regular"}
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
                            checked={r.estado === "Malo"}
                            onChange={() =>
                              handleResponseChange(id, "estado", "Malo")
                            }
                            className="mr-1"
                          />
                          M
                        </label>
                      </div>

                      {(id === "8.1" || id === "8.2" || id === "8.3") && (
                        <div className="flex gap-2 items-center justify-center">
                          <p className="text-xs font-bold">Cantidad</p>
                          <NumericInput
                            disabled={false}
                            label=""
                            subLabel=""
                            value={r.cantidad}
                            onChange={(value: number | undefined) =>
                              handleResponseChange(id, "cantidad", value ?? 0)
                            }
                          />
                        </div>
                      )}

                      {(id === "8.1" || id === "8.2") && (
                        <div className="flex gap-2 items-center justify-center">
                          <p className="text-xs font-bold">
                            ¿Se realiza mantenimiento?
                          </p>
                          <label>
                            <input
                              type="radio"
                              name={`mantenimiento-${id}`}
                              value="No"
                              checked={r.mantenimiento === "No"}
                              onChange={() =>
                                handleResponseChange(id, "mantenimiento", "No")
                              }
                              className="mr-1"
                            />
                            No
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`mantenimiento-${id}`}
                              value="Si"
                              checked={r.mantenimiento === "Si"}
                              onChange={() =>
                                handleResponseChange(id, "mantenimiento", "Si")
                              }
                              className="mr-1"
                            />
                            Sí
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md disabled:opacity-60"
        >
          {isSubmitting
            ? "Guardando..."
            : editando
            ? "Actualizar información"
            : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
