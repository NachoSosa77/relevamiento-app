/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { tipoComedorOpciones } from "../config/tipoComerdor";

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

interface EspecificacionesComedor {
  id?: number; // opcional, por si querés almacenarlo
  disponibilidad: string;
  tipos_comedor?: string[];
}

const parseTipos = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    try {
      const j = JSON.parse(v);
      return Array.isArray(j) ? (j as string[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function Comedor({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const relevamientoId = useRelevamientoId();
  const [responses, setResponses] = useState<Record<string, EspecificacionesComedor>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);

  // Mapa rápido: question → id (para alinear GET (por texto) con tu tabla (por id))
  const questionToId = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of servicios) m.set(s.question, s.id);
    return m;
  }, [servicios]);

  const loadData = async () => {
    if (!relevamientoId || !construccionId) return;

    try {
      const res = await fetch(
        `/api/uso_comedor?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );
      if (!res.ok) {
        setResponses({});
        setEditando(false);
        return;
      }
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const next: Record<string, EspecificacionesComedor> = {};
        data.forEach((item: any) => {
          const sid = questionToId.get(item.servicio); // buscar el id de la fila por el texto del servicio
          if (!sid) return;
          next[sid] = {
            id: item.id,
            disponibilidad: item.disponibilidad || "",
            tipos_comedor: parseTipos(item.tipos_comedor),
          };
        });
        setResponses(next);
        setEditando(true);
      } else {
        setResponses({});
        setEditando(false);
      }
    } catch (error) {
      console.error("Error al cargar datos de comedor:", error);
      setResponses({});
      setEditando(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relevamientoId, construccionId, questionToId]);

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad",
    value: string
  ) => {
    if (field === "disponibilidad" && value === "No") {
      // si elige "No" en una fila condicional, limpiamos tipos
      setResponses((prev) => ({
        ...prev,
        [servicioId]: { disponibilidad: "No", tipos_comedor: [] },
      }));
      return;
    }

    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleCheckboxChange = (servicioId: string, name: string) => {
    setResponses((prev) => {
      const current = prev[servicioId]?.tipos_comedor || [];
      const updated = current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name];

      return {
        ...prev,
        [servicioId]: {
          ...prev[servicioId],
          tipos_comedor: updated,
        },
      };
    });
  };

  const handleGuardar = async () => {
    // detectar si hay al menos algún dato a enviar
    const hayAlgunDato = servicios.some((servicio) => {
      const r = responses[servicio.id];
      return (
        (r?.disponibilidad && r.disponibilidad.trim() !== "") ||
        (r?.tipos_comedor && r.tipos_comedor.length > 0)
      );
    });

    if (!hayAlgunDato) {
      toast.warning("Por favor completa al menos un dato para continuar");
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: servicios
        .map((servicio) => {
          const r = responses[servicio.id];
          if (!r) return null;

          // Si es fila condicional y marcó "No", solo enviamos la disponibilidad
          if (servicio.showCondition && r.disponibilidad === "No") {
            return {
              servicio: servicio.question,
              disponibilidad: "No",
              tipos_comedor: null,
            };
          }

          // Si no aportó nada útil, omitimos
          const hayContenido =
            (r.disponibilidad && r.disponibilidad.trim() !== "") ||
            (r.tipos_comedor && r.tipos_comedor.length > 0);

          if (!hayContenido) return null;

          return {
            servicio: servicio.question,
            disponibilidad: r.disponibilidad || "",
            tipos_comedor: r.tipos_comedor || [],
          };
        })
        .filter(Boolean),
    };

    const save = async (method: "POST" | "PATCH") => {
      const response = await fetch("/api/uso_comedor", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response;
    };

    setIsSubmitting(true);
    try {
      let resp = await save(editando ? "PATCH" : "POST");

      // si ya existía, el back responde 409 → hacemos PATCH
      if (!resp.ok && resp.status === 409) {
        resp = await save("PATCH");
      }

      const result = await resp.json();
      if (!resp.ok) throw new Error(result?.error || "Error al guardar los datos");

      toast.success(editando ? "Datos de comedor actualizados correctamente" : "Datos de comedor guardados correctamente");

      // refresco para mostrar lo persistido y activar banner
      await loadData();
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

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Sí</th>
            <th className="border p-2">No</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border text-sm">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>

              {!showCondition ? (
                // Fila NO condicional: checkboxes de tipos
                <>
                  <td className="border p-2 text-center">
                    <div className="grid grid-cols-3 gap-2">
                      {tipoComedorOpciones.map((opcion) => (
                        <label key={opcion.id} className="text-sm inline-flex items-center gap-1">
                          {opcion.prefijo}
                          <input
                            type="checkbox"
                            name={`tipo-${id}-${opcion.name}`}
                            checked={responses[id]?.tipos_comedor?.includes(opcion.name) || false}
                            onChange={() => handleCheckboxChange(id, opcion.name)}
                            disabled={responses[id]?.disponibilidad === "No"}
                          />
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                    <p>
                      A - En comedor B - SUM/patio cubierto/gimnasio C - En aulas D - áreas de
                      circulación E - Otro
                    </p>
                  </td>
                  <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                    <p>
                      El servicio se presta en aulas (C): pase al ítem 10. Resto: al ítem 9.3
                    </p>
                  </td>
                </>
              ) : (
                // Fila condicional: radios Sí/No
                <>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="Si"
                      checked={responses[id]?.disponibilidad === "Si"}
                      onChange={() => handleResponseChange(id, "disponibilidad", "Si")}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="No"
                      checked={responses[id]?.disponibilidad === "No"}
                      onChange={() => handleResponseChange(id, "disponibilidad", "No")}
                    />
                  </td>
                  <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                    <p>Si: Pase al ítem 9.2 y complete el cuadro. No: pase al ítem 10</p>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className={`text-sm font-bold p-2 rounded-lg ${
            isSubmitting ? "bg-gray-400 cursor-wait text-white" : "bg-custom hover:bg-custom/50 text-white"
          }`}
        >
          {isSubmitting ? "Guardando..." : editando ? "Actualizar información" : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
