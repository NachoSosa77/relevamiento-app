/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { calidadPropAgua } from "../config/relevamientoAgua";
import CalidadAguaComponent from "./CalidadAguaComponent";
import ServicioBasicoComponent from "./ServicioBasicoComponent";

interface AguaFormComponentProps {
  relevamientoId: number;
}

interface ServicioBasicoData {
  tipo_provision: string;
  tipo_provision_estado: string;
  tipo_almacenamiento: string;
  tipo_almacenamiento_estado: string;
  alcance: string[];
}

interface CalidadAguaData {
  tratamiento: string;
  tipo_tratamiento: string;
  control_sanitario: string;
  cantidad_veces: string;
}

export default function AguaFormComponent({ relevamientoId }: AguaFormComponentProps) {
  const [servicioBasico, setServicioBasico] = useState<ServicioBasicoData>({
    tipo_provision: "",
    tipo_provision_estado: "",
    tipo_almacenamiento: "",
    tipo_almacenamiento_estado: "",
    alcance: [],
  });

  const [calidadAgua, setCalidadAgua] = useState<CalidadAguaData>({
    tratamiento: "",
    tipo_tratamiento: "",
    control_sanitario: "",
    cantidad_veces: "",
  });

  const handleSubmit = async () => {
  // Verificamos si al menos uno de los campos está completo (no vacío o no nulo)
  const hasSomeData =
    servicioBasico.tipo_provision ||
    servicioBasico.tipo_provision_estado ||
    servicioBasico.tipo_almacenamiento ||
    servicioBasico.tipo_almacenamiento_estado ||
    (servicioBasico.alcance && servicioBasico.alcance.length > 0) ||
    calidadAgua.tratamiento ||
    calidadAgua.tipo_tratamiento ||
    calidadAgua.control_sanitario ||
    calidadAgua.cantidad_veces;

  if (!hasSomeData) {
    toast.warning("Por favor, completá al menos un campo antes de guardar.");
    return;
  }

  const data = {
    ...servicioBasico,
    ...calidadAgua,
    relevamiento_id: relevamientoId,
  };

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
  }
};

  

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      <ServicioBasicoComponent
        onChange={(data) => {
          setServicioBasico(data); // Actualiza el estado de servicioBasico
        }}
      />
      <CalidadAguaComponent
        onChange={(data) => {
          setCalidadAgua(data); // Actualiza el estado de calidadAgua
        }}
        servicios={calidadPropAgua}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-custom hover:bg-custom/50 text-white font-bold p-2 rounded-lg"
        >
          Guardar información
        </button>
      </div>
    </div>
  );
}
