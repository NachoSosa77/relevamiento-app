/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Servicio {
  id: string;           // ej "7.2"
  question: string;     // texto visible
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

export default function SeguridadIncendio({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<
    Record<
      string,
      {
        disponibilidad?: string;
        cantidad?: number;
        carga_anual_matafuegos?: string;
        simulacros_evacuacion?: string;
      }
    >
  >({});
  const [cantidadOptions, setCantidadOptions] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  // Mapa id -> pregunta y pregunta -> id (para matchear con la API que devuelve "servicio" como texto)
  const preguntasById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of servicios) m[s.id] = s.question;
    return m;
  }, [servicios]);

  const idByPregunta = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of servicios) m[s.question] = s.id;
    return m;
  }, [servicios]);

  const norm = (v?: string | null) => {
    if (!v) return "";
    const t = v.trim().toLowerCase();
    if (t === "sí" || t === "si") return "Si";
    if (t === "no" || t === "n") return "No";
    if (t === "nc" || t === "ns") return t.toUpperCase();
    // valores especiales de tu formulario
    if (t === "en todas") return "En todas";
    if (t === "en algunas") return "En algunas";
    if (t === "en ninguna") return "En ninguna";
    if (t === "en todos") return "En todos";
    if (t === "sólo pb" || t === "solo pb") return "Sólo PB";
    return v.trim();
  };

  // GET inicial
  const fetchData = useCallback(async () => {
    if (!relevamientoId || !construccionId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/instalaciones_seguridad_incendio?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );

      if (res.status === 404) {
        setResponses({});
        setCantidadOptions({});
        setEditando(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rows: any[] = await res.json(); // <-- array con { id, servicio, disponibilidad, cantidad, ... }

      const nextResp: typeof responses = {};
      const nextCant: typeof cantidadOptions = {};
      let matches = 0;

      for (const row of rows) {
        const sid = idByPregunta[row.servicio]; // match por texto exacto
        if (!sid) {
          // Si no hay match exacto, podés loguear para revisar textos divergentes
          // console.warn("No match para servicio API:", row.servicio);
          continue;
        }
        matches++;
        nextResp[sid] = {
          disponibilidad: norm(row.disponibilidad),
          cantidad: Number(row.cantidad ?? 0),
          carga_anual_matafuegos: norm(row.carga_anual_matafuegos),
          simulacros_evacuacion: norm(row.simulacros_evacuacion),
        };
        nextCant[sid] = Number(row.cantidad ?? 0);
      }

      setResponses(nextResp);
      setCantidadOptions(nextCant);
      setEditando(matches > 0);
    } catch (e) {
      console.error("Error GET seguridad/incendio:", e);
      setResponses({});
      setCantidadOptions({});
      setEditando(false);
    } finally {
      setIsLoading(false);
    }
  }, [relevamientoId, construccionId, idByPregunta]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResponseChange = (
    servicioId: string,
    field:
      | "disponibilidad"
      | "carga_anual_matafuegos"
      | "cantidad"
      | "simulacros_evacuacion",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleGuardar = async () => {
    if (!relevamientoId || !construccionId) return;
    if (isSubmitting) return;

    const serviciosValidos = Object.keys(responses).filter((sid) => {
      const r = responses[sid] || {};
      const cant = cantidadOptions[sid] ?? r.cantidad ?? 0;
      return (
        (r.disponibilidad && r.disponibilidad.trim() !== "") ||
        (r.carga_anual_matafuegos &&
          r.carga_anual_matafuegos.trim() !== "") ||
        (r.simulacros_evacuacion &&
          r.simulacros_evacuacion.trim() !== "") ||
        Number(cant) > 0
      );
    });

    if (serviciosValidos.length === 0) {
      toast.warning("Completá al menos un dato antes de guardar.");
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: serviciosValidos.map((sid) => ({
        servicio_id: sid,                       // útil para backend
        servicio: preguntasById[sid] || "Unknown",
        disponibilidad: responses[sid]?.disponibilidad || "",
        carga_anual_matafuegos:
          responses[sid]?.carga_anual_matafuegos || "",
        cantidad: cantidadOptions[sid] ?? responses[sid]?.cantidad ?? 0,
        simulacros_evacuacion:
          responses[sid]?.simulacros_evacuacion || "",
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/instalaciones_seguridad_incendio", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      toast.success(
        editando ? "Datos actualizados correctamente" : "Datos guardados correctamente"
      );

      // refresco para que el usuario vea lo que quedó
      await fetchData();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {/* Banner edición sólo cuando ya cargó y hay datos */}
      {!isLoading && editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}

      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border">
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
            {sub_id === 7 && <th className="border p-2">Nc</th>}
            <th className="border p-2">Especificaciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>

              {/* Radios No */}
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="No"
                  checked={(responses[id]?.disponibilidad || "") === "No"}
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "No")
                  }
                  disabled={isLoading || isSubmitting}
                />
              </td>

              {/* Radios Si */}
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="Si"
                  checked={(responses[id]?.disponibilidad || "") === "Si"}
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "Si")
                  }
                  disabled={isLoading || isSubmitting}
                />
              </td>

              {/* Radio NC sólo si aplica */}
              {sub_id === 7 && (
                <td className="border p-2 text-center">
                  {id === "7.2" && (
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="NC"
                      checked={(responses[id]?.disponibilidad || "") === "NC"}
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "NC")
                      }
                      disabled={isLoading || isSubmitting}
                    />
                  )}
                </td>
              )}

              {/* Especificaciones */}
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "text-slate-400" : ""
                }`}
              >
                {!showCondition ? (
                  "No corresponde"
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    {/* NumericInput para 7.2 y 7.7 */}
                    {(id === "7.2" || id === "7.7") && (
                      <NumericInput
                        disabled={isLoading || isSubmitting}
                        label={
                          id === "7.2"
                            ? "Cantidad de bocas de incendio"
                            : "Cantidad de salidas"
                        }
                        subLabel=""
                        value={cantidadOptions[id] || 0}
                        onChange={(value: number | undefined) =>
                          setCantidadOptions((prev) => ({
                            ...prev,
                            [id]: value ?? 0,
                          }))
                        }
                      />
                    )}

                    {/* Cantidad + carga anual para 7.3 a 7.6 */}
                    {(id === "7.3" ||
                      id === "7.4" ||
                      id === "7.5" ||
                      id === "7.6") && (
                      <div className="flex gap-2 items-center justify-center">
                        <NumericInput
                          disabled={isLoading || isSubmitting}
                          label="Cantidad"
                          subLabel=""
                          value={cantidadOptions[id] || 0}
                          onChange={(value: number | undefined) =>
                            setCantidadOptions((prev) => ({
                              ...prev,
                              [id]: value ?? 0,
                            }))
                          }
                        />
                        <div className="flex gap-2 items-center justify-center">
                          ¿Se realiza carga anual de los matafuegos?{" "}
                          {["No", "No sabe", "Si"].map((opt) => (
                            <label key={opt}>
                              <input
                                type="radio"
                                name={`carga-anual-${id}`}
                                value={opt}
                                checked={
                                  (responses[id]?.carga_anual_matafuegos ||
                                    "") === opt
                                }
                                onChange={() =>
                                  handleResponseChange(
                                    id,
                                    "carga_anual_matafuegos",
                                    opt
                                  )
                                }
                                className="mr-1"
                                disabled={isLoading || isSubmitting}
                              />
                              {opt === "No sabe" ? "NS" : opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Opciones especiales 7.8 */}
                    {id === "7.8" && (
                      <div className="flex gap-4 items-center justify-center">
                        {["En todas", "En algunas", "En ninguna"].map((opt) => (
                          <label key={opt}>
                            <input
                              type="radio"
                              name={`disponibilidad-${id}`}
                              value={opt}
                              checked={
                                (responses[id]?.disponibilidad || "") === opt
                              }
                              onChange={() =>
                                handleResponseChange(id, "disponibilidad", opt)
                              }
                              className="mr-1"
                              disabled={isLoading || isSubmitting}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Simulacros 7.10 */}
                    {id === "7.10" && (
                      <div className="flex gap-2 items-center justify-center">
                        ¿Se realizan simulacros de evacuación?{" "}
                        {["No", "No sabe", "Si"].map((opt) => (
                          <label key={opt}>
                            <input
                              type="radio"
                              name={`simulacros_evacuacion-${id}`}
                              value={opt}
                              checked={
                                (responses[id]?.simulacros_evacuacion || "") ===
                                opt
                              }
                              onChange={() =>
                                handleResponseChange(
                                  id,
                                  "simulacros_evacuacion",
                                  opt
                                )
                              }
                              className="mr-1"
                              disabled={isLoading || isSubmitting}
                            />
                            {opt === "No sabe" ? "NS" : opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* 7.11 */}
                    {id === "7.11" && (
                      <div className="flex gap-4 items-center justify-center">
                        {["En todos", "Sólo PB", "En ninguno"].map((opt) => (
                          <label key={opt}>
                            <input
                              type="radio"
                              name={`disponibilidad-${id}`}
                              value={opt}
                              checked={
                                (responses[id]?.disponibilidad || "") === opt
                              }
                              onChange={() =>
                                handleResponseChange(id, "disponibilidad", opt)
                              }
                              className="mr-1"
                              disabled={isLoading || isSubmitting}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* 7.15 */}
                    {id === "7.15" && (
                      <div className="flex gap-4 items-center justify-center">
                        {["En todos", "En algunos", "En ninguno", "Ns"].map(
                          (opt) => (
                            <label key={opt}>
                              <input
                                type="radio"
                                name={`disponibilidad-${id}`}
                                value={opt}
                                checked={
                                  (responses[id]?.disponibilidad || "") === opt
                                }
                                onChange={() =>
                                  handleResponseChange(
                                    id,
                                    "disponibilidad",
                                    opt
                                  )
                                }
                                className="mr-1"
                                disabled={isLoading || isSubmitting}
                              />
                              {opt === "Ns" ? "NS" : opt}
                            </label>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón guardar/actualizar */}
      <div className="mt-4 flex justify-end">
        <button
          disabled={isSubmitting || isLoading}
          onClick={handleGuardar}
          className={`text-white text-sm font-bold p-2 rounded-lg ${
            isSubmitting || isLoading
              ? "bg-gray-400 cursor-wait"
              : "bg-custom hover:bg-custom/50"
          }`}
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
