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
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  estructuras: Estructura[];
  construccionId: number | null;
}

export default function CaracteristicasConservacion({
  id,
  label,
  estructuras,
  construccionId,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string; estructura: string }>
  >({});
  const relevamientoId = useRelevamientoId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    if (!relevamientoId || !construccionId) return;
    try {
      const res = await fetch(
        `/api/estado_conservacion?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const initialResponses: Record<string, any> = {};
          data.forEach((item: any) => {
            initialResponses[item.estructura] = {  // ojo que usás estructura como id en la clave?
              disponibilidad: item.disponibilidad || "",
              estado: item.estado || "",
              estructura: item.estructura || "",
            };
          });
          setResponses(initialResponses);
          setEditando(true);  // para mostrar el banner amarillo
        } else {
          setEditando(false); // si no hay datos existentes
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de conservación:", error);
    }
  };

  fetchData();
}, [relevamientoId, construccionId]);


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

  const handleGuardar = async () => {
    const estructurasValidas = estructuras.every((estructura) => {
      const respuesta = responses[estructura.id];
      if (!respuesta) return false;
      if (estructura.showCondition && estructura.id !== "13.1") {
        return !!respuesta.estructura?.trim() && !!respuesta.estado?.trim();
      }
      if (!estructura.showCondition && estructura.id === "13.1") {
        return respuesta.disponibilidad === "Si" || respuesta.disponibilidad === "No";
      }
      return true;
    });

    if (!estructurasValidas) {
      toast.warning("Por favor, completa todas las respuestas antes de guardar.");
      return;
    }

    if (editando) {
      setMostrarModal(true);
      return;
    }

    await enviarDatos();
  };

  const enviarDatos = async (esUpdate = false) => {
  const payload = estructuras.map((estructura) => {
    const respuesta = responses[estructura.id];
    return {
      estructura: respuesta.estructura || "",
      disponibilidad: respuesta.disponibilidad || "",
      estado: respuesta.estado || "",
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
    };
  });

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/estado_conservacion", {
        method: editando ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success(
        editando
          ? "Datos de conservación actualizados correctamente"
          : "Datos de conservación guardados correctamente"
      );
        if (!esUpdate) setEditando(true); // porque ahora ya existe registro
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      toast.error(error.message || "Error al guardar los datos");
    }
    setIsSubmitting(false);
    setMostrarModal(false);
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
            <th className="border p-2  text-white">{id}</th>
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
          {estructuras.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2 text-center">
                {id !== "13.1" ? (
                  <Select
                    label=""
                    value={responses[id]?.estructura || ""}
                    onChange={(e) =>
                      handleResponseChange(id, "estructura", e.target.value)
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
                      name={`disponibilidad-${id}`}
                      value="No"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "No")
                      }
                    />
                  </label>
                )}
              </td>
              <td className="border p-2 text-center">
                {showCondition && id !== "13.1" ? (
                  <div className="flex gap-2 items-center justify-center">
                    <label>
                      <input
                        type="radio"
                        name={`estado-${id}`}
                        value="Bueno"
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
                        onChange={() =>
                          handleResponseChange(id, "estado", "Malo")
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
                      name={`disponibilidad-${id}`}
                      value="Si"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "Si")
                      }
                    />
                  </label>
                )}
              </td>
              {!showCondition && (
                <td className="border p-2 text-center">
                  <TextInput
                    label="Indique cuales"
                    sublabel=""
                    value=""
                    onChange={(e) => {}}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-sm text-white font-bold p-2 rounded-lg"
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </button>
      </div>

      <ConfirmModal
  isOpen={mostrarModal}
  onConfirm={() => enviarDatos(true)} // enviar update
  onClose={() => setMostrarModal(false)}
  message="Ya existe un registro. ¿Deseás actualizar la información existente?"
/>

    </div>
  );
}
