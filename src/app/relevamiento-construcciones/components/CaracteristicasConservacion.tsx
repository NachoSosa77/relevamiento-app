/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Estructura {
  id: string;                 // ej: "13.2", "13.3", "13.1"
  question: string;
  showCondition: boolean;     // true: tiene estado B/R/M; false: “No corresponde” (última col)
  opciones: Opcion[];         // catálogo para el <Select /> (excepto 13.1 que es Si/No)
}

interface EstructuraReuProps {
  id: number;
  label: string;
  estructuras: Estructura[];
  construccionId: number | null;
  tipo: string;
}

type Resp = { disponibilidad: string; estado: string; estructura: string };

export default function CaracteristicasConservacion({
  id,
  label,
  estructuras,
  construccionId,
  tipo,
}: EstructuraReuProps) {
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<Record<string, Resp>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ---- Load (GET) + mapeo DB → UI
  useEffect(() => {
    const fetchData = async () => {
      if (!relevamientoId || !construccionId) return;
      try {
        const res = await fetch(
          `/api/estado_conservacion?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: any[] = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, Resp> = {};

          for (const row of data) {
            // row.estructura es el NOMBRE (texto) guardado en DB
            const estructuraText: string = row.estructura ?? "";
            let keyId: string | null = null;

            // Caso especial 13.1: no usa opciones, sólo Si/No en disponibilidad
            if (estructuras.some(e => e.id === "13.1") && !estructuraText) {
              keyId = "13.1";
            }

            // Para el resto, buscamos qué estructura (por id) contiene esa opción por nombre
            if (!keyId) {
              for (const e of estructuras) {
                if (e.id === "13.1") continue; // 13.1 no tiene opciones
                if (e.opciones?.some(op => op.name === estructuraText)) {
                  keyId = e.id;
                  break;
                }
              }
            }

            // Si no logramos mapear, skip
            if (!keyId) continue;

            next[keyId] = {
              disponibilidad: row.disponibilidad ?? "",
              estado: row.estado ?? "",
              estructura: estructuraText ?? "",
            };
          }

          setResponses(next);
          setEditando(Object.keys(next).length > 0);
        } else {
          setResponses({});
          setEditando(false);
        }
      } catch (err) {
        console.error("Error al cargar datos de conservación:", err);
        setResponses({});
        setEditando(false);
      }
    };

    fetchData();
  }, [relevamientoId, construccionId, estructuras]);

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado" | "estructura",
    value: string
  ) => {
    setResponses(prev => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  // ---- Validación simple
  const validar = () => {
    for (const e of estructuras) {
      const r = responses[e.id] || { disponibilidad: "", estado: "", estructura: "" };

      if (e.id === "13.1") {
        // 13.1 sólo necesita disponibilidad Si/No
        if (r.disponibilidad !== "Si" && r.disponibilidad !== "No") {
          return false;
        }
        continue;
      }

      if (e.showCondition) {
        // Necesita estructura (texto del select) y estado (B/R/M)
        if (!r.estructura?.trim()) return false;
        if (!["Bueno", "Regular", "Malo"].includes(r.estado)) return false;
      }
      // Si no showCondition (celda “No corresponde”), no exigimos nada extra
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) {
      toast.warning("Por favor, completá todas las respuestas antes de guardar.");
      return;
    }

    if (editando) {
      setMostrarModal(true);
    } else {
      await enviarDatos(false);
    }
  };

  // ---- POST/PATCH + refresco
  const enviarDatos = async (esUpdate: boolean) => {
    // Armamos payload como ARRAY (un registro por estructura)
    const payload = estructuras.map(e => {
      const r = responses[e.id] || { disponibilidad: "", estado: "", estructura: "" };

      // Para 13.1 guardamos solo disp. (estructura puede ir vacío)
      return {
        estructura: e.id === "13.1" ? "" : r.estructura || "",
        disponibilidad: e.id === "13.1" ? (r.disponibilidad || "") : (r.disponibilidad || ""),
        estado: e.id === "13.1" ? "" : (r.estado || ""),
        relevamiento_id: relevamientoId,
        construccion_id: construccionId,
        tipo,
      };
    });

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/estado_conservacion", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Error al guardar los datos");

      toast.success(editando ? "Datos actualizados correctamente" : "Datos guardados correctamente");

      // 🔄 Re-fetch para ver lo persistido y asegurar banner
      try {
        const ref = await fetch(
          `/api/estado_conservacion?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        const data: any[] = ref.ok ? await ref.json() : [];
        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, Resp> = {};
          for (const row of data) {
            const estructuraText: string = row.estructura ?? "";
            let keyId: string | null = null;

            if (estructuras.some(e => e.id === "13.1") && !estructuraText) {
              keyId = "13.1";
            }
            if (!keyId) {
              for (const e of estructuras) {
                if (e.id === "13.1") continue;
                if (e.opciones?.some(op => op.name === estructuraText)) {
                  keyId = e.id;
                  break;
                }
              }
            }
            if (!keyId) continue;

            next[keyId] = {
              disponibilidad: row.disponibilidad ?? "",
              estado: row.estado ?? "",
              estructura: estructuraText ?? "",
            };
          }
          setResponses(next);
          setEditando(true);
        }
      } catch { /* ignore re-fetch errors, ya guardado */ }

    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      toast.error(error.message || "Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
      setMostrarModal(false);
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      <table className="w-full border rounded-t-lg mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2 text-white">{id}</th>
            <th className="border p-2">{label}</th>
            {id !== 13 ? <th className="border p-2">Descripción</th> : <th className="border p-2">No</th>}
            {id !== 13 ? <th className="border p-2">Estado de conservación</th> : <th className="border p-2">Si</th>}
            {id === 13 && <th className="border p-2"></th>}
          </tr>
        </thead>
        <tbody>
          {estructuras.map(({ id, question, showCondition, opciones }) => {
            const r = responses[id] || { disponibilidad: "", estado: "", estructura: "" };

            return (
              <tr className="border" key={id}>
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2">{question}</td>

                {/* Columna 3 */}
                <td className="border p-2 text-center">
                  {id !== "13.1" ? (
                    <Select
                      label=""
                      value={r.estructura || ""}
                      onChange={(e) => handleResponseChange(id, "estructura", e.target.value)}
                      options={opciones.map((option) => ({
                        value: option.name,
                        label: `${option.prefijo} ${option.name}`,
                      }))}
                    />
                  ) : (
                    <label>
                      <input
                        type="radio"
                        name={`disp-${id}`}
                        value="No"
                        checked={r.disponibilidad === "No"}
                        onChange={() => handleResponseChange(id, "disponibilidad", "No")}
                      />
                    </label>
                  )}
                </td>

                {/* Columna 4 */}
                <td className="border p-2 text-center">
                  {showCondition && id !== "13.1" ? (
                    <div className="flex gap-2 items-center justify-center">
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Bueno"
                          checked={r.estado === "Bueno"}
                          onChange={() => handleResponseChange(id, "estado", "Bueno")}
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
                          onChange={() => handleResponseChange(id, "estado", "Regular")}
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
                          onChange={() => handleResponseChange(id, "estado", "Malo")}
                          className="mr-1"
                        />
                        M
                      </label>
                    </div>
                  ) : (
                    <label>
                      <input
                        type="radio"
                        name={`disp-${id}`}
                        value="Si"
                        checked={r.disponibilidad === "Si"}
                        onChange={() => handleResponseChange(id, "disponibilidad", "Si")}
                      />
                    </label>
                  )}
                </td>

                {/* Columna 5 (solo fila 13.x sin condición) */}
                {!showCondition && (
                  <td className="border p-2 text-center">
                    <TextInput
                      label="Indique cuales"
                      sublabel=""
                      value=""             // aún no definido en modelo de DB; placeholder
                      onChange={() => {}}  // pendiente si decides persistir este campo
                    />
                  </td>
                )}
              </tr>
            );
          })}
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

      <ConfirmModal
        isOpen={mostrarModal}
        onConfirm={() => enviarDatos(true)}
        onClose={() => setMostrarModal(false)}
        message="Ya existe un registro. ¿Deseás actualizar la información existente?"
      />
    </div>
  );
}
