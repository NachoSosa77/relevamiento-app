/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ServicioBasicoComponent from "./ServicioBasicoComponent";

interface AguaFormComponentProps {
  relevamientoId?: number;
  construccionId?: number | null;
}

interface ServicioBasicoData {
  tipo_provision: string[];
  tipo_provision_estado: string[];
  tipo_almacenamiento: string[];
  tipo_almacenamiento_estado: string[];
  alcance: string[];
  tratamiento?: string;
  tipo_tratamiento?: string;
  control_sanitario?: string;
  cantidad_veces?: string;
}

export default function AguaFormComponent({ relevamientoId, construccionId }: AguaFormComponentProps) {
  const [servicioBasico, setServicioBasico] = useState<ServicioBasicoData>({
  tipo_provision: [],
  tipo_provision_estado: [],
  tipo_almacenamiento: [],
  tipo_almacenamiento_estado: [],
  alcance: [],
  tratamiento: "",
  tipo_tratamiento: "",
  control_sanitario: "",
  cantidad_veces: "",
});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!relevamientoId) {
    toast.error("Falta el ID del relevamiento.");
    return;
  }
    const hasData =
      servicioBasico.tipo_provision.length > 0 ||
      servicioBasico.tipo_almacenamiento.length > 0 ||
      servicioBasico.alcance.length > 0 

    if (!hasData) {
      toast.warning("Por favor, completá al menos un campo antes de guardar.");
      return;
    }

    const data = {
      ...servicioBasico,
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
    };
setLoading(true);
    try {
      const response = await fetch("/api/servicio_agua", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success("Servicio de agua guardado correctamente");
    } catch (error: any) {
      console.error("Error al enviar datos:", error);
      toast.error(error.message || "Error al guardar los datos");
    }finally {
    setLoading(false);
  }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
            <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>3</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">
            AGUA
          </p>
        </div>
      </div>

      <ServicioBasicoComponent
        onChange={(data) => setServicioBasico(data)}
      />

      <div className="flex justify-end mt-4">
        <button
        disabled={loading}
          onClick={handleSubmit}
          className="bg-custom hover:bg-custom/50 text-white font-bold p-2 rounded-lg"
        >
          {loading ? "Guardando..." : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
