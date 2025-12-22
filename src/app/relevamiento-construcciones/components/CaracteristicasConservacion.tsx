/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Estructura {
  id: string; // ej: "13.2", "13.3", "13.1"
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
  sub_tipo?: "estructura" | "cubierta" | "materiales" | "terminaciones" | "n/a";
}

interface EstructuraReuProps {
  id: number;
  label: string;
  relevamientoId: number;
  estructuras: Estructura[];
  construccionId: number | null;
  tipo: string;
}

// 👈 Ahora guardamos también el id de la fila en DB
type Resp = {
  idDb?: number | null;
  disponibilidad: string;
  estado: string;
  estructura: string;
};

export default function CaracteristicasConservacion({
  id,
  label,
  relevamientoId,
  estructuras,
  construccionId,
  tipo,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<Record<string, Resp>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ---- Load (GET) + mapeo DB → UI
  useEffect(() => {
    const fetchData = async () => {
      if (!relevamientoId || !construccionId) return;

      setResponses({});
      setEditando(false);
      try {
        const res = await fetch(
          `/api/estado_conservacion?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: any[] = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, Resp> = {};

          // lookup sub_tipo -> id para este bloque
          const ID_BY_SUBTIPO: Record<string, string> = {};
          for (const e of estructuras) {
            if (e.sub_tipo) ID_BY_SUBTIPO[e.sub_tipo.toLowerCase()] = e.id;
          }

          for (const row of data) {
            const rowTipo = (row.tipo || "").toLowerCase();
            const propTipo = (tipo || "").toLowerCase();

            // 🔹 Si la fila tiene tipo, filtramos. Si viene null, la aceptamos (datos viejos).
            if (rowTipo && rowTipo !== propTipo) continue;

            const estructuraText: string = row.estructura ?? "";
            const subTipo: string = (row.sub_tipo || "").toLowerCase();
            let keyId: string | null = null;

            // 1) priorizar mapeo por sub_tipo
            if (subTipo && ID_BY_SUBTIPO[subTipo]) {
              keyId = ID_BY_SUBTIPO[subTipo];
            }

            // 2) fallback por texto (como ya tenías)
            if (!keyId) {
              if (estructuras.some((e) => e.id === "13.1") && !estructuraText) {
                keyId = "13.1";
              }
              if (!keyId) {
                for (const e of estructuras) {
                  if (e.id === "13.1") continue;
                  if (e.opciones?.some((op) => op.name === estructuraText)) {
                    keyId = e.id;
                    break;
                  }
                }
              }
            }

            if (!keyId) continue;

            next[keyId] = {
              idDb: row.id ?? null, // 👈 guardamos el id de DB
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
  }, [relevamientoId, construccionId, estructuras, tipo]);

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado" | "estructura",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  // ---- Validación simple
  const validar = () => {
    for (const e of estructuras) {
      const r = responses[e.id] || {
        idDb: null,
        disponibilidad: "",
        estado: "",
        estructura: "",
      };

      if (e.id === "13.1") {
        if (r.disponibilidad !== "Si" && r.disponibilidad !== "No") {
          return false;
        }
        continue;
      }

      if (e.showCondition) {
        if (!r.estructura?.trim()) return false;
        if (!["Bueno", "Regular", "Malo"].includes(r.estado)) return false;
      }
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) {
      toast.warning(
        "Por favor, completá todas las respuestas antes de guardar."
      );
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
    const payload = estructuras.map((e) => {
      const r = responses[e.id] || {
        idDb: null,
        disponibilidad: "",
        estado: "",
        estructura: "",
      };

      return {
        id: r.idDb ?? null, // 👈 mandamos el id de DB si existe
        estructura: e.id === "13.1" ? "" : r.estructura || "",
        disponibilidad: r.disponibilidad || "",
        estado: e.id === "13.1" ? "" : r.estado || "",
        relevamiento_id: relevamientoId,
        construccion_id: construccionId,
        tipo,
        sub_tipo: e.sub_tipo ?? null,
      };
    });

    console.log("payload estado_conservacion:", payload);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/estado_conservacion", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.error || "Error al guardar los datos");

      toast.success(
        editando
          ? "Datos actualizados correctamente"
          : "Datos guardados correctamente"
      );

      // Re-fetch para ver lo persistido
      try {
        const ref = await fetch(
          `/api/estado_conservacion?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        const data: any[] = ref.ok ? await ref.json() : [];
        if (Array.isArray(data) && data.length > 0) {
          const next: Record<string, Resp> = {};

          const ID_BY_SUBTIPO: Record<string, string> = {};
          for (const e of estructuras) {
            if (e.sub_tipo) ID_BY_SUBTIPO[e.sub_tipo.toLowerCase()] = e.id;
          }

          for (const row of data) {
            const rowTipo = (row.tipo || "").toLowerCase();
            const propTipo = (tipo || "").toLowerCase();
            if (rowTipo && rowTipo !== propTipo) continue;

            const estructuraText: string = row.estructura ?? "";
            const subTipo: string = (row.sub_tipo || "").toLowerCase();
            let keyId: string | null = null;

            if (subTipo && ID_BY_SUBTIPO[subTipo]) {
              keyId = ID_BY_SUBTIPO[subTipo];
            }

            if (!keyId) {
              if (estructuras.some((e) => e.id === "13.1") && !estructuraText) {
                keyId = "13.1";
              }
              if (!keyId) {
                for (const e of estructuras) {
                  if (e.id === "13.1") continue;
                  if (e.opciones?.some((op) => op.name === estructuraText)) {
                    keyId = e.id;
                    break;
                  }
                }
              }
            }

            if (!keyId) continue;

            next[keyId] = {
              idDb: row.id ?? null, // 👈 volvemos a guardar el id
              disponibilidad: row.disponibilidad ?? "",
              estado: row.estado ?? "",
              estructura: estructuraText ?? "",
            };
          }

          setResponses(next);
          setEditando(true);
        }
      } catch {
        /* ignore re-fetch errors */
      }
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
            {id !== 13 ? (
              <th className="border p-2">Descripción</th>
            ) : (
              <th className="border p-2">No</th>
            )}
            {id !== 13 ? (
              <th className="border p-2">Estado de conservación</th>
            ) : (
              <th className="border p-2">Si</th>
            )}
            {id === 13 && <th className="border p-2"></th>}
          </tr>
        </thead>
        <tbody>
          {estructuras.map(
            ({ id: idStr, question, showCondition, opciones }) => {
              const r = responses[idStr] || {
                idDb: null,
                disponibilidad: "",
                estado: "",
                estructura: "",
              };

              return (
                <tr className="border" key={idStr}>
                  <td className="border p-2 text-center">{idStr}</td>
                  <td className="border p-2">{question}</td>

                  {/* Columna 3 */}
                  <td className="border p-2 text-center">
                    {idStr !== "13.1" ? (
                      <Select
                        label=""
                        value={r.estructura || ""}
                        onChange={(e) =>
                          handleResponseChange(
                            idStr,
                            "estructura",
                            e.target.value
                          )
                        }
                        options={opciones.map((option) => ({
                          value: option.name,
                          label: `${option.prefijo} ${option.name}`,
                        }))}
                      />
                    ) : (
                      <label>
                        <input
                          type="radio"
                          name={`disp-${idStr}`}
                          value="No"
                          checked={r.disponibilidad === "No"}
                          onChange={() =>
                            handleResponseChange(idStr, "disponibilidad", "No")
                          }
                        />
                      </label>
                    )}
                  </td>

                  {/* Columna 4 */}
                  <td className="border p-2 text-center">
                    {showCondition && idStr !== "13.1" ? (
                      <div className="flex gap-2 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`estado-${idStr}`}
                            value="Bueno"
                            checked={r.estado === "Bueno"}
                            onChange={() =>
                              handleResponseChange(idStr, "estado", "Bueno")
                            }
                            className="mr-1"
                          />
                          B
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${idStr}`}
                            value="Regular"
                            checked={r.estado === "Regular"}
                            onChange={() =>
                              handleResponseChange(idStr, "estado", "Regular")
                            }
                            className="mr-1"
                          />
                          R
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${idStr}`}
                            value="Malo"
                            checked={r.estado === "Malo"}
                            onChange={() =>
                              handleResponseChange(idStr, "estado", "Malo")
                            }
                            className="mr-1"
                          />
                          M
                        </label>
                      </div>
                    ) : (
                      <label>
                        <input
                          type="radio"
                          name={`disp-${idStr}`}
                          value="Si"
                          checked={r.disponibilidad === "Si"}
                          onChange={() =>
                            handleResponseChange(idStr, "disponibilidad", "Si")
                          }
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
                        value="" // placeholder (a futuro si querés persistir este campo)
                        onChange={() => {}}
                      />
                    </td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className={`text-sm font-bold p-2 rounded-lg ${
            isSubmitting
              ? "bg-gray-400 cursor-wait text-white"
              : "bg-custom hover:bg-custom/50 text-white"
          }`}
        >
          {isSubmitting
            ? "Guardando..."
            : editando
            ? "Actualizar información"
            : "Guardar información"}
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
