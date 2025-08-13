/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import { localesService } from "@/services/localesServices";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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
}

interface EstructuraReuProps {
  id: number;
  label: string;
  locales: Locales[];
}

export default function SistemaContraRobo({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);

  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<
    Record<string, Opcion | null>
  >({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleOpcionChange = (
    value: string,
    opciones: Opcion[],
    localId: string
  ) => {
    const seleccionada =
      opciones.find((opt) => String(opt.id) === value) || null;

    setOpcionesSeleccionadas((prev) => ({
      ...prev,
      [localId]: seleccionada,
    }));
  };

  const handleGuardar = async () => {
  const datosAGuardar = Object.entries(opcionesSeleccionadas).map(
    ([key, opcion]) => ({
      id: localId, // o podrías usar Number(key) si es uno por fila
      proteccion_contra_robo: opcion?.name || null,
    })
  );

  const hayAlMenosUnDato = datosAGuardar.some(
    (dato) => dato.proteccion_contra_robo && dato.proteccion_contra_robo.trim() !== ""
  );

  if (!hayAlMenosUnDato) {
    toast.warning("Por favor, seleccioná al menos una opción antes de guardar.");
    return;
  }
      if (isSubmitting) return; // prevenir doble clic
    setIsSubmitting(true); // Deshabilitar botón mientras se envía


  try {
    for (const dato of datosAGuardar) {
      await localesService.updateConstruccionAntiRoboById(dato.id, {
        proteccion_contra_robo: dato.proteccion_contra_robo!,
      });
    }
    toast.success("Información guardada correctamente");
  } catch (error) {
    console.error("Error al guardar:", error);
    toast.error("Error al guardar los datos");
  }
          setIsSubmitting(false); // Rehabilitar botón después de enviar

};


  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
        <div className="w-6 h-6 rounded-full flex justify-center items-center text-custom bg-white">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>
      <table className="w-full border text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2">
                <Select
                  label=""
                  value={opcionesSeleccionadas[id] ? opcionesSeleccionadas[id].id.toString() : ""}
                  onChange={(e) =>
                    handleOpcionChange(e.target.value, opciones, id)
                  }
                  options={opciones.map((option) => ({
                    value: option.id,
                    label: `${option.prefijo} - ${option.name}`,
                  }))}
                />
              </td>
            </tr>
          ))}
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
