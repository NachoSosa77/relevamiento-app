/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Estructura {
  id: string;                 // ej: "14.1", "14.2", etc
  question: string;
  showCondition: boolean;     // si false, muestra "Indique cuál"
  opciones: Opcion[];         // catálogo (puede estar vacío si es texto libre)
}

interface EstructuraReuProps {
  id: number;                 // N° de bloque
  label: string;              // Título del bloque
  estructuras: Estructura[];
  construccionId: number | null;
}

type Resp = { disponibilidad: string; tipo: string };

export default function EnergiasAlternativas({
  id,
  label,
  estructuras,
  construccionId,
}: EstructuraReuProps) {
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<Record<string, Resp>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);

  const puedeGuardar = useMemo(() => !!relevamientoId && !!construccionId, [relevamientoId, construccionId]);

  // ------- CARGA INICIAL (GET) -------
  useEffect(() => {
    const load = async () => {
      if (!relevamientoId || !construccionId) return;

      try {
        const res = await fetch(
          `/api/energias_alternativas?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );

        if (!res.ok) {
          // si no hay datos, tratamos como vacío
          setEditando(false);
          setResponses({});
          return;
        }

        const data: Array<{ disponibilidad?: string; tipo?: string }> = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, Resp> = {};

          for (const row of data) {
            const rowTipo = (row.tipo ?? "").trim();
            const rowDisp = (row.disponibilidad ?? "").trim();

            // Intento encontrar a qué fila (estructura) pertenece:
            let matchId: string | null = null;

            for (const e of estructuras) {
              // Si la fila tiene catálogo, busco coincidencia por nombre
              if (e.opciones?.length) {
                if (e.opciones.some(op => op.name === rowTipo)) {
                  matchId = e.id;
                  break;
                }
              }
            }

            // Si no encontré por catálogo, igual seteo en la primera que sea "texto libre"
            if (!matchId) {
              const libre = estructuras.find(e => !e.showCondition);
              matchId = libre?.id ?? estructuras[0]?.id;
            }

            if (matchId) {
              next[matchId] = {
                disponibilidad: rowDisp,
                tipo: rowTipo,
              };
            }
          }

          setResponses(next);
          setEditando(true);
        } else {
          setResponses({});
          setEditando(false);
        }
      } catch (err) {
        console.error("Error al cargar energías alternativas:", err);
        setResponses({});
        setEditando(false);
      }
    };

    load();
  }, [relevamientoId, construccionId, estructuras]);

  // ------- HANDLERS DE UI -------
  const handleResponseChange = (
    servicioId: string,
    field: keyof Resp,
    value: string
  ) => {
    setResponses(prev => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  // ------- GUARDAR (POST o PATCH) -------
  const handleGuardar = async () => {
    if (!puedeGuardar) {
      toast.warning("Faltan datos de contexto (relevamiento o construcción).");
      return;
    }

    // construyo payload sólo con filas que tengan al menos un dato
    const payload = estructuras
      .map(e => {
        const r = responses[e.id] || { disponibilidad: "", tipo: "" };

        // Si la pregunta NO tiene condición (texto libre), basta con 'tipo' o disponibilidad
        // Si tiene condición y es select, esperamos tipo si hay catálogo o al menos disponibilidad
        const tieneAlgo =
          (r.disponibilidad && r.disponibilidad.trim() !== "") ||
          (r.tipo && r.tipo.trim() !== "");

        if (!tieneAlgo) return null;

        return {
          tipo: r.tipo || "", // si es select, irá el nombre del catálogo; si es libre, el texto ingresado
          disponibilidad: r.disponibilidad || "",
          relevamiento_id: relevamientoId,
          construccion_id: construccionId,
        };
      })
      .filter(Boolean);

    if (payload.length === 0) {
      toast.warning("No se completó ningún dato para guardar.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Primero intento POST si aún no hay datos (editando=false). Si hay 409, reintento con PATCH.
      const doRequest = async (method: "POST" | "PATCH") => {
        const resp = await fetch("/api/energias_alternativas", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          const err: any = new Error(json?.error || `HTTP ${resp.status}`);
          err.status = resp.status;
          throw err;
        }
        return json;
      };

      try {
        await doRequest(editando ? "PATCH" : "POST");
      } catch (e: any) {
        if (!editando && e?.status === 409) {
          // ya existía → actualizo
          await doRequest("PATCH");
        } else {
          throw e;
        }
      }

      toast.success(editando ? "Datos actualizados correctamente" : "Datos guardados correctamente");

      // 🔁 Re-fetch para ver lo persistido y encender banner
      try {
        const ref = await fetch(
          `/api/energias_alternativas?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (ref.ok) {
          const data: Array<{ disponibilidad?: string; tipo?: string }> = await ref.json();
          const next: Record<string, Resp> = {};

          for (const row of data) {
            const rowTipo = (row.tipo ?? "").trim();
            const rowDisp = (row.disponibilidad ?? "").trim();
            let matchId: string | null = null;

            for (const e of estructuras) {
              if (e.opciones?.length && e.opciones.some(op => op.name === rowTipo)) {
                matchId = e.id;
                break;
              }
            }
            if (!matchId) {
              const libre = estructuras.find(e => !e.showCondition);
              matchId = libre?.id ?? estructuras[0]?.id;
            }
            if (matchId) {
              next[matchId] = { disponibilidad: rowDisp, tipo: rowTipo };
            }
          }

          setResponses(next);
          setEditando(true);
        }
      } catch {}

    } catch (error: any) {
      console.error("Error al guardar energías alternativas:", error);
      toast.error(error?.message || "Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2 text-white">{id}</th>
            <th className="border p-2">{label}</th>
            <th className="border p-2">Tipo / Descripción</th>
            <th className="border p-2">Disponibilidad</th>
          </tr>
        </thead>
        <tbody>
          {estructuras.map(({ id: rowId, question, showCondition, opciones }) => {
            const r = responses[rowId] || { disponibilidad: "", tipo: "" };
            const esTextoLibre = !showCondition || opciones.length === 0;

            return (
              <tr className="border" key={rowId}>
                <td className="border p-2 text-center">{rowId}</td>
                <td className="border p-2">{question}</td>

                {/* Tipo: select si hay opciones, sino input libre */}
                <td className="border p-2 text-center">
                  {esTextoLibre ? (
                    <TextInput
                      label=""
                      sublabel=""
                      value={r.tipo}
                      onChange={e => handleResponseChange(rowId, "tipo", e.target.value)}
                    />
                  ) : (
                    <Select
                      label=""
                      value={r.tipo}
                      onChange={e => handleResponseChange(rowId, "tipo", e.target.value)}
                      options={opciones.map((o) => ({
                        value: o.name,
                        label: `${o.prefijo} ${o.name}`,
                      }))}
                    />
                  )}
                </td>

                {/* Disponibilidad: Si / No */}
                <td className="border p-2 text-center">
                  <div className="flex gap-4 justify-center">
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="radio"
                        name={`disp-${rowId}`}
                        value="Si"
                        checked={r.disponibilidad === "Si"}
                        onChange={() => handleResponseChange(rowId, "disponibilidad", "Si")}
                      />
                      <span>Si</span>
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="radio"
                        name={`disp-${rowId}`}
                        value="No"
                        checked={r.disponibilidad === "No"}
                        onChange={() => handleResponseChange(rowId, "disponibilidad", "No")}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting || !puedeGuardar}
          className={`text-sm font-bold p-2 rounded-lg ${
            isSubmitting || !puedeGuardar
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-custom hover:bg-custom/50 text-white"
          }`}
        >
          {isSubmitting ? "Guardando..." : editando ? "Actualizar información" : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
