/* eslint-disable @typescript-eslint/no-explicit-any */

import NumericInput from "@/components/ui/NumericInput";
import Select from "@/components/ui/SelectComponent";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tipoCombustibleOpciones } from "../config/tipoCombustible";

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

/** Normaliza texto para comparar: sin may/min, sin tildes, trim */
function normalizarTexto(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function ElectricidadServicio({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const [responses, setResponses] = useState<{
    [key: string]: {
      disponibilidad: string;
      estado: string;
      especificaciones?: string;
      estado_bateria?: string;
    };
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const relevamientoId = useRelevamientoId();

  // Estado para almacenar el tipo de combustible de cada servicio
  const [combustibleOptions, setCombustibleOptions] = useState<{
    [key: string]: string;
  }>({});

  // Estado para almacenar la potencia de cada servicio
  const [potenciaOptions, setPotenciaOptions] = useState<{
    [key: string]: number;
  }>({});

  const fetchDatos = useCallback(async () => {
    if (!relevamientoId || !construccionId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/servicio_electricidad?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );
      if (!res.ok) throw new Error("Error al cargar datos");

      const data = await res.json();


      setEditando(Array.isArray(data) && data.length > 0);

      const newResponses: typeof responses = {};
      const newCombustibleOptions: typeof combustibleOptions = {};
      const newPotenciaOptions: typeof potenciaOptions = {};

      // contador de ocurrencias por texto normalizado
      const ocurrenciasPorTexto: Record<string, number> = {};

      data.forEach((item: any) => {
        const rawQuestion: string = item.servicio;
        const normalizedRaw = normalizarTexto(rawQuestion);

        const prevCount = ocurrenciasPorTexto[normalizedRaw] ?? 0;
        const currentCount = prevCount + 1;
        ocurrenciasPorTexto[normalizedRaw] = currentCount;

        // candidatos con la misma pregunta (normalizada)
        const candidatos = servicios.filter(
          (s) => normalizarTexto(s.question) === normalizedRaw
        );

        if (candidatos.length === 0) {
          return;
        }

        let servicioMatch: Servicio;

        if (candidatos.length === 1) {
          // caso simple: solo un servicio con ese texto
          servicioMatch = candidatos[0];
        } else {
          // caso con duplicados: ordenamos por id numérico y usamos la ocurrencia 1,2,...
          const ordenados = [...candidatos].sort((a, b) => {
            const na = parseFloat(a.id);
            const nb = parseFloat(b.id);
            if (isNaN(na) || isNaN(nb)) {
              return a.id.localeCompare(b.id);
            }
            return na - nb;
          });

          // currentCount es 1 para la primera vez que aparece ese texto, 2 para la segunda, etc.
          servicioMatch = ordenados[currentCount - 1] ?? ordenados[0];

        }

        const servicioId = servicioMatch.id;

        newResponses[servicioId] = {
          disponibilidad: item.disponibilidad || "",
          estado: item.estado || "",
          especificaciones: item.especificaciones || "",
          estado_bateria: item.estado_bateria || "",
        };

        newCombustibleOptions[servicioId] = item.tipo_combustible || "";
        newPotenciaOptions[servicioId] = Number(item.potencia) || 0;
      });


      setResponses(newResponses);
      setCombustibleOptions(newCombustibleOptions);
      setPotenciaOptions(newPotenciaOptions);
    } catch (error: unknown) {
      console.error("Error cargando datos electricidad:", error);
    } finally {
      setLoading(false);
    }
  }, [relevamientoId, construccionId, servicios]);

  useEffect(() => {
    if (!relevamientoId || !construccionId) return;
    fetchDatos();
  }, [relevamientoId, construccionId, fetchDatos]);

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado" | "especificaciones" | "estado_bateria",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleGuardar = async () => {
    // Verificamos si hay al menos un servicio con algún dato no vacío
    const hayAlgunDato = servicios.some((servicio) => {
      const serviceId = servicio.id;
      const respuesta = responses[serviceId];

      return (
        (respuesta?.disponibilidad && respuesta.disponibilidad.trim() !== "") ||
        (respuesta?.estado && respuesta.estado.trim() !== "") ||
        (respuesta?.estado_bateria && respuesta.estado_bateria.trim() !== "") ||
        (combustibleOptions[serviceId] &&
          combustibleOptions[serviceId].trim() !== "") ||
        (potenciaOptions[serviceId] && potenciaOptions[serviceId] !== 0)
      );
    });

    if (!hayAlgunDato) {
      toast.warning("Por favor complete al menos un dato para continuar");
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: servicios.map((servicio) => {
        const resp = responses[servicio.id] || {};
        return {
          servicio: servicio.question,
          disponibilidad: resp.disponibilidad || "",
          estado: resp.estado || "",
          estado_bateria: resp.estado_bateria || "",
          tipo_combustible: combustibleOptions[servicio.id] || "",
          potencia: potenciaOptions[servicio.id] || 0,
        };
      }),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/servicio_electricidad", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success("Servicio de electricidad guardado correctamente");
      await fetchDatos();
    } catch (error: unknown) {
      let mensaje = "Error al guardar los datos";
      if (error instanceof Error) {
        mensaje = error.message;
      }
      toast.error(mensaje);
    }
    setIsSubmitting(false);
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
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}
      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
      )}
      {loading ? (
        <div className="space-y-2 mt-2">
          {Array.from({ length: servicios.length }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-2 border p-2 rounded-lg bg-gray-200 h-10"
            ></div>
          ))}
        </div>
      ) : (
        <table className="w-full border mt-2 text-xs">
          <thead>
            <tr className="bg-custom text-white">
              <th className="border p-2"></th>
              <th className="border p-2"></th>
              <th className="border p-2">No</th>
              <th className="border p-2">Sí</th>
              {sub_id === 6.2 && <th className="border p-2">NS</th>}
              {sub_id !== 6.2 && <th className="border p-2">Estado</th>}
              {sub_id !== 6.2 && (
                <th className="border p-2">Especificaciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {servicios.map(({ id: serviceId, question, showCondition }) => (
              <tr key={serviceId} className="border">
                <td className="border p-2 text-center">{serviceId}</td>
                <td className="border p-2">{question}</td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    name={`disponibilidad-${serviceId}`}
                    value="No"
                    checked={responses[serviceId]?.disponibilidad === "No"}
                    onChange={(e) =>
                      handleResponseChange(
                        serviceId,
                        "disponibilidad",
                        e.target.checked ? "No" : ""
                      )
                    }
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    name={`disponibilidad-${serviceId}`}
                    value="Si"
                    checked={responses[serviceId]?.disponibilidad === "Si"}
                    onChange={(e) =>
                      handleResponseChange(
                        serviceId,
                        "disponibilidad",
                        e.target.checked ? "Si" : ""
                      )
                    }
                  />
                </td>
                {serviceId === "6.2.4" || serviceId === "6.2.8" ? (
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      name={`disponibilidad-${serviceId}`}
                      value="NS"
                      checked={responses[serviceId]?.disponibilidad === "NS"}
                      onChange={(e) =>
                        handleResponseChange(
                          serviceId,
                          "disponibilidad",
                          e.target.checked ? "NS" : ""
                        )
                      }
                    />
                  </td>
                ) : null}
                {sub_id !== 6.2 && (
                  <td
                    className={`border p-2 text-center ${
                      !showCondition ? " text-slate-400" : ""
                    }`}
                  >
                    {!showCondition ? (
                      "No corresponde"
                    ) : (
                      <div className="flex gap-2 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`estado-${serviceId}`}
                            value="Bueno"
                            checked={responses[serviceId]?.estado === "Bueno"}
                            onChange={() =>
                              handleResponseChange(serviceId, "estado", "Bueno")
                            }
                            className="mr-1"
                          />
                          B
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${serviceId}`}
                            value="Regular"
                            checked={
                              responses[serviceId]?.estado === "Regular"
                            }
                            onChange={() =>
                              handleResponseChange(
                                serviceId,
                                "estado",
                                "Regular"
                              )
                            }
                            className="mr-1"
                          />
                          R
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${serviceId}`}
                            value="Malo"
                            checked={responses[serviceId]?.estado === "Malo"}
                            onChange={() =>
                              handleResponseChange(serviceId, "estado", "Malo")
                            }
                            className="mr-1"
                          />
                          M
                        </label>
                      </div>
                    )}
                  </td>
                )}
                {sub_id !== 6.2 && (
                  <td
                    className={`border p-2 text-center ${
                      !showCondition ? " text-slate-400" : ""
                    }`}
                  >
                    {!showCondition ? (
                      "No corresponde"
                    ) : (
                      <div className="flex gap-2 items-center justify-center">
                        {serviceId === "6.1.2" || serviceId === "6.1.4" ? (
                          <p className="mr-2 font-bold whitespace-nowrap">
                            Potencia
                          </p>
                        ) : (
                          <p className="mr-2 font-bold whitespace-nowrap">
                            Potencia (Vp panel x N paneles)
                          </p>
                        )}
                        <NumericInput
                          subLabel=""
                          disabled={false}
                          label=""
                          value={potenciaOptions[serviceId] || 0}
                          onChange={(value: number | undefined) => {
                            setPotenciaOptions((prev) => ({
                              ...prev,
                              [serviceId]: value ?? 0,
                            }));
                          }}
                        />
                        {serviceId === "6.1.2" && (
                          <label className="flex items-center">
                            <p className="mr-2 font-bold">
                              Tipo de combustible:
                            </p>
                            <Select
                              label=""
                              value={combustibleOptions[serviceId] || ""}
                              onChange={(e) =>
                                setCombustibleOptions((prev) => ({
                                  ...prev,
                                  [serviceId]: e.target.value,
                                }))
                              }
                              options={tipoCombustibleOpciones.map(
                                (option) => ({
                                  value: option.question,
                                  label: option.question,
                                })
                              )}
                            />
                          </label>
                        )}
                        {(serviceId === "6.1.3" || serviceId === "6.1.4") && (
                          <div className="flex items-center">
                            <p className="mr-2 font-bold whitespace-nowrap">
                              Estado de la batería:
                            </p>
                            <Select
                              label=""
                              value={responses[serviceId]?.estado_bateria || ""}
                              onChange={(e) =>
                                handleResponseChange(
                                  serviceId,
                                  "estado_bateria",
                                  e.target.value
                                )
                              }
                              options={[
                                { value: "Bueno", label: "Bueno" },
                                { value: "Regular", label: "Regular" },
                                { value: "Malo", label: "Malo" },
                              ]}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-end">
        <button
          disabled={isSubmitting}
          onClick={handleGuardar}
          className="text-white text-sm bg-custom hover:bg-custom/50 font-bold p-2 rounded-lg"
        >
          {isSubmitting
            ? editando
              ? "Actualizando..."
              : "Guardando..."
            : editando
            ? "Actualizar información"
            : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
