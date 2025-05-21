/* eslint-disable @typescript-eslint/no-unused-vars */
import Select from "@/components/ui/SelectComponent";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Locales {
  id: string;  // Asegúrate de que este id sea siempre de tipo `string`
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
  motivos?: Opcion[]; // Opcionales motivos por item
}

interface EstructuraReuProps {
  id: string;  // Este id debe ser un string para que coincida con los ids de Locales
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
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const [responses, setResponses] = useState<
    Record<string, { disponibilidad?: string; funciona?: string; motivo?: string }>
  >({});

  const handleDisponibilidadChange = (servicioId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: {
        ...prev[servicioId],
        disponibilidad: value,
        funciona: undefined, // reset
        motivo: undefined,    // reset
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
      },
    }));
  };

  const handleGuardar = async () => {
  const payload = locales.map(({ id, question }) => {
    const respuesta = responses[id];

    return {
      servicio: question,
      tipo_instalacion: respuesta?.disponibilidad || "No",
      funciona: respuesta?.funciona || "No",
      motivo: respuesta?.funciona === "No" ? respuesta?.motivo || "No" : "",
      relevamiento_id: relevamientoId,
      local_id: localId,
    };
  });

  const hayAlMenosUnDato = payload.some(
    (item) =>
      item.tipo_instalacion !== "No" || item.funciona !== "No" || (item.motivo && item.motivo.trim() !== "")
  );

  if (!hayAlMenosUnDato) {
    toast.warning("Por favor, completá al menos un servicio antes de guardar.");
    return;
  }

  try {
    const response = await fetch("/api/instalaciones_basicas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    toast.success("Información guardada correctamente");
  } catch (error) {
    console.error(error);
    toast.error("Error al guardar los datos");
  }
};


  // IDs de los servicios que no deben renderizar la columna "Motivo"
  const noRenderMotivoIds = ["8.1.5", "8.1.6", "8.1.7"];

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2">{sub_id}</th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Funciona</th>
            {/* Renderizar solo si no está en la lista de IDs para no renderizar "Motivo" */}
            {!noRenderMotivoIds.includes(id) && (
              <th className="border p-2">Motivo</th>
            )}
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones, motivos }) => {
            const respuesta = responses[id] || {};
            const showFunciona = showCondition ? !!respuesta.disponibilidad : true;
            const showMotivo = showFunciona && respuesta.funciona === "No" && !noRenderMotivoIds.includes(id);

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
                        value: String(option.name), // Asegúrate de convertir a string aquí
                        label: option.name,
                      }))}
                    />
                  ):(
                    <div className="bg-slate-200 w-full p-2 text-center"><p>No corresponde</p></div>
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

                {/* Renderizar solo si no está en la lista de IDs para no renderizar "Motivo" */}
                {showMotivo && (
                  <td className="border p-2">
                    <Select
                      label=""
                      value={respuesta.motivo || ""}
                      onChange={(e) => handleMotivoChange(id, e.target.value)}
                      options={(motivos ?? []).map((option) => ({
                        value: String(option.id), // Convertimos a string aquí también
                        label: option.name,
                      }))}
                    />
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
          className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
