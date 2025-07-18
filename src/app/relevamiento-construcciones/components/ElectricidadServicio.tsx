/* eslint-disable @typescript-eslint/no-explicit-any */

import NumericInput from "@/components/ui/NumericInput";
import Select from "@/components/ui/SelectComponent";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useState } from "react";
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

  const relevamientoId = useRelevamientoId();

  // Estado para almacenar el tipo de combustible de cada servicio
  const [combustibleOptions, setCombustibleOptions] = useState<{
    [key: string]: string;
  }>({});

  // Estado para almacenar la potencia de cada servicio
  const [potenciaOptions, setPotenciaOptions] = useState<{
    [key: string]: number; // Cambiado para ser string porque los IDs de los servicios son strings
  }>({});

  useEffect(() => {
  if (!relevamientoId || !construccionId) return;

  async function fetchDatos() {
    try {
      const res = await fetch(
        `/api/servicio_electricidad?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
      );
      if (!res.ok) throw new Error("Error al cargar datos");

      const data = await res.json();
      setEditando(data.length > 0);
      // Transformamos los datos para llenar los estados
      const newResponses: typeof responses = {};
      const newCombustibleOptions: typeof combustibleOptions = {};
      const newPotenciaOptions: typeof potenciaOptions = {};

      data.forEach((item: any) => {
        const servicioId = servicios.find(s => s.question === item.servicio)?.id;
        if (!servicioId) return; // saltar si no coincide

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
    } catch (error) {
      console.error("Error cargando datos electricidad:", error);
    }
  }

  fetchDatos();
}, [relevamientoId, construccionId, servicios]);

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
      const id = servicio.id;
      const respuesta = responses[id];

      // Revisamos si cualquiera de los campos tiene valor significativo
      return (
        (respuesta?.disponibilidad && respuesta.disponibilidad.trim() !== "") ||
        (respuesta?.estado && respuesta.estado.trim() !== "") ||
        (respuesta?.estado_bateria && respuesta.estado_bateria.trim() !== "") ||
        (combustibleOptions[id] && combustibleOptions[id].trim() !== "") ||
        (potenciaOptions[id] && potenciaOptions[id] !== 0)
      );
    });

    if (!hayAlgunDato) {
      toast.warning("Por favor complete al menos un dato para continuar");
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: Object.keys(responses).map((key) => ({
        servicio:
          servicios.find((servicio) => servicio.id === key)?.question ||
          "Unknown",
        disponibilidad: responses[key]?.disponibilidad || "",
        estado: responses[key]?.estado || "",
        estado_bateria: responses[key]?.estado_bateria || "",
        tipo_combustible: combustibleOptions[key] || "",
        potencia: potenciaOptions[key] || 0,
      })),
    };
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/servicio_electricidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success("Servicio de electricidad guardado correctamente");
    } catch (error: any) {
      toast.error(error.message || "Error al guardar los datos");
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

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">No</th>
            <th className="border p-2">Sí</th>
            {sub_id === 6.2 && <th className="border p-2">NS</th>}
            {sub_id !== 6.2 && <th className="border p-2">Estado</th>}
            {sub_id !== 6.2 && <th className="border p-2">Especificaciones</th>}
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="No"
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
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "Si")
                  }
                />
              </td>
              {id === "6.2.4" || id === "6.2.8" ? (
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="NS"
                    onChange={() =>
                      handleResponseChange(id, "disponibilidad", "NS")
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
                      {id === "6.1.2" || id === "6.1.4" ? (
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
                        value={potenciaOptions[id] || 0} // Aquí usamos el id de cada servicio
                        onChange={(value: number | undefined) => {
                          setPotenciaOptions({
                            ...potenciaOptions,
                            [id]: value ?? 0, // Usamos el id de cada servicio para almacenar potencia
                          });
                        }}
                      />
                      {id === "6.1.2" && (
                        <label className="flex items-center">
                          <p className="mr-2 font-bold">Tipo de combustible:</p>
                          <Select
                            label=""
                            value={combustibleOptions[id] || ""} // Aquí usamos el 'question' como valor
                            onChange={(e) =>
                              setCombustibleOptions({
                                ...combustibleOptions,
                                [id]: e.target.value, // Guardamos el 'question' seleccionado en lugar del 'id'
                              })
                            }
                            options={tipoCombustibleOpciones.map((option) => ({
                              value: option.question, // 'question' como el valor
                              label: option.question, // 'question' como la etiqueta también
                            }))}
                          />
                        </label>
                      )}
                      {/* Select solo para 6.1.3 y 6.1.4 */}
                      {(id === "6.1.3" || id === "6.1.4") && (
                        <div className="flex items-center">
                          <p className="mr-2 font-bold whitespace-nowrap">
                            Estado de la batería:
                          </p>
                          <Select
                            label=""
                            value={responses[id]?.estado_bateria || ""}
                            onChange={(e) =>
                              handleResponseChange(
                                id,
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

      <div className="mt-4 flex justify-end">
        <button
          disabled={isSubmitting}
          onClick={handleGuardar}
          className="text-white text-sm bg-custom hover:bg-custom/50 font-bold p-2 rounded-lg"
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
