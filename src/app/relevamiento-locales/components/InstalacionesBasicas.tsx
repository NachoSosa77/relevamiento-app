"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import {
  InstalacionBasica,
  ResponseState,
} from "@/interfaces/InterfaceInstalacionesBasicas";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiciosBasicosSkeleton from "./skeletons/ServiciosBasicosSkeleton";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
  motivos?: Opcion[];
}

interface EstructuraReuProps {
  id: string;
  sub_id: number;
  label: string;
  locales: Locales[];
}

export default function ServiciosBasicos({
  id,
  sub_id,
  label,
  locales,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();
  const [responses, setResponses] = useState<Record<string, ResponseState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Cargar datos existentes
  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/instalaciones_basicas?localId=${localId}&relevamientoId=${relevamientoId}`
        );
        if (!res.ok) throw new Error("Error al cargar instalaciones básicas");
        const data = await res.json();

        if (data.length > 0) {
          setIsEditing(true);
        }

        // Mapear la data al formato de responses
        const inicial: Record<string, ResponseState> = {};
        locales.forEach((loc) => {
          const encontrado = (data as InstalacionBasica[]).find(
            (d) => d.servicio === loc.question
          );
          if (encontrado) {
            inicial[loc.id] = {
              id: encontrado.id, // 👈 guardamos el ID
              disponibilidad:
                encontrado.tipo_instalacion !== "No"
                  ? encontrado.tipo_instalacion
                  : "No",
              funciona: encontrado.funciona,
              motivo: encontrado.motivo || "",
              otroMotivo:
                encontrado.motivo === "Otro" ? encontrado.motivo : undefined,
            };
          }
        });
        setResponses(inicial);
      } catch (err) {
        console.error(err);
        toast.error("Error al leer los datos de instalaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId, locales]);

  const handleDisponibilidadChange = (servicioId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: {
        ...prev[servicioId],
        disponibilidad: value,
        funciona: undefined,
        motivo: undefined,
      },
    }));
  };

  const handleFuncionaChange = (servicioId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: {
        ...prev[servicioId],
        funciona: value,
        motivo: value === "No" ? prev[servicioId]?.motivo : undefined,
      },
    }));
  };

  const handleMotivoChange = (servicioId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: {
        ...prev[servicioId],
        motivo: value,
        otroMotivo:
          value === "Otro" ? prev[servicioId]?.otroMotivo || "" : undefined,
      },
    }));
  };

  const handleGuardar = async () => {
    const payload = locales.map(({ id, question, motivos }) => {
      const respuesta = responses[id];

      let motivoTexto = "";
      if (respuesta?.funciona === "No") {
        if (respuesta?.motivo === "6") {
          motivoTexto = respuesta?.otroMotivo || "Otro";
        } else {
          const motivoEncontrado = motivos?.find(
            (motivo) => String(motivo.id) === respuesta?.motivo
          );
          motivoTexto = motivoEncontrado?.name || respuesta?.motivo || "";
        }
      }

      return {
        id: respuesta?.id,
        servicio: question,
        tipo_instalacion: respuesta?.disponibilidad || null,
        funciona: respuesta?.funciona || null,
        motivo: motivoTexto || null,
        relevamiento_id: relevamientoId,
        local_id: localId,
      };
    });

    const hayAlMenosUnDato = payload.some(
  (item) =>
    item.tipo_instalacion !== null ||
    item.funciona !== null ||
    (item.motivo && item.motivo.trim() !== "")
);

    if (!hayAlMenosUnDato) {
      toast.warning(
        "Por favor, completá al menos un servicio antes de guardar."
      );
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/instalaciones_basicas", {
        method: isEditing ? "PUT" : "POST", // 👈 si edita → PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al guardar");
      toast.success("Información guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los datos");
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <ServiciosBasicosSkeleton />;

  // IDs que no muestran "Motivo"
  const noRenderMotivoIds = ["8.1.5", "8.1.6", "8.1.7"];

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
        {isEditing && (
          <div className="bg-yellow-100 text-yellow-700 p-2 mb-2 rounded-md text-xs">
            ⚠️ Este local ya tiene datos. Podés editarlos y guardar nuevamente.
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
            <th className="border p-2">{sub_id}</th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Funciona</th>
            {!noRenderMotivoIds.includes(id) && (
              <th className="border p-2">Motivo</th>
            )}
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones, motivos }) => {
            const respuesta = responses[id] || {};
            const showFunciona = showCondition
              ? !!respuesta.disponibilidad
              : true;
            const showMotivo =
              showFunciona &&
              respuesta.funciona === "No" &&
              !noRenderMotivoIds.includes(id);

            return (
              <tr className="border" key={id}>
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2">{question}</td>

                <td className="border p-2">
                  {showCondition ? (
                    <Select
                      label=""
                      value={respuesta.disponibilidad || ""}
                      onChange={(e) =>
                        handleDisponibilidadChange(id, e.target.value)
                      }
                      options={opciones.map((option) => ({
                        value: String(option.name),
                        label: option.name,
                      }))}
                    />
                  ) : (
                    <div className="bg-slate-200 w-full p-2 text-center">
                      <p>No corresponde</p>
                    </div>
                  )}
                </td>

                <td className="border p-2 text-center">
                  {showFunciona && showCondition && (
                    <div className="flex gap-2 items-center justify-center">
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Si"
                          checked={respuesta.funciona === "Si"}
                          onChange={() => handleFuncionaChange(id, "Si")}
                          className="mr-1"
                        />
                        Sí
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="No"
                          checked={respuesta.funciona === "No"}
                          onChange={() => handleFuncionaChange(id, "No")}
                          className="mr-1"
                        />
                        No
                      </label>
                    </div>
                  )}
                </td>

                {showMotivo && (
                  <td className="border p-2">
                    <Select
                      label=""
                      value={respuesta.motivo || ""}
                      onChange={(e) => handleMotivoChange(id, e.target.value)}
                      options={(motivos ?? []).map((option) => ({
                        value: String(option.id),
                        label: option.name,
                      }))}
                    />
                    {respuesta.motivo === "6" && (
                      <TextInput
                        label="Otro motivo"
                        sublabel="Especificar motivo"
                        className="border px-2 py-1 text-sm"
                        value={respuesta.otroMotivo || ""}
                        onChange={(e) =>
                          setResponses((prev) => ({
                            ...prev,
                            [id]: {
                              ...prev[id],
                              otroMotivo: e.target.value,
                            },
                          }))
                        }
                      />
                    )}
                  </td>
                )}
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
          {isSubmitting ? "Guardando..." : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
