"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useLocalObject } from "@/hooks/useLocalSection";
import { OpcionLocal, useOpcionesLocales } from "@/hooks/useOpcionesLocales";
import { useEffect, useState } from "react";
import { tipo_Sistema_Contra_Robo } from "../config/tipoSistemaContraRobo";

export interface LocalInfo {
  local_id: number;
  relevamiento_id: number;
  identificacion_plano: string | null;
  numero_planta: number | null;
  local_sin_uso: string | null; // "Si" | "No"
  superficie: string | null;
  cui_number: number | null;
  tipo: string | null;
  largo_predominante: string | null;
  ancho_predominante: string | null;
  diametro: string | null;
  altura_maxima: string | null;
  altura_minima: string | null;
  destino_original: string | null;
  proteccion_contra_robo: string | null;
  observaciones: string | null;
  tipo_superficie: string | null;
  numero_construccion: string | null;
  estado: string | null;
  nombre_local: string | null;
}

interface Props {
  localId: number;
  relevamientoId: number;
}

const LocalInfoEditable = ({ localId, relevamientoId }: Props) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalObject<LocalInfo>(localId, relevamientoId, "local");

  const [local, setLocal] = useState<LocalInfo | null>(null);
  const [observacionesTemp, setObservacionesTemp] = useState("");

  const { opciones, loading: loadingOpciones } = useOpcionesLocales();

  useEffect(() => {
    if (data && "local" in data) {
      const l = data.local as LocalInfo;
      setLocal(l); // antes ya lo hacías
      setObservacionesTemp(l.observaciones ?? ""); // 👈 ahora además inicializás el estado de observaciones
    }
  }, [data]);


  const handleChange = (field: keyof LocalInfo, value: string | number | null) => {
    if (!local) return;
    const updated = { ...local, [field]: value };
    setLocal(updated);
    updateData(updated);
  };

  const handleDescripcionChange = (opcion: OpcionLocal) => {
    if (!local) return;

    const updated = {
      ...local,
      tipo: opcion.tipo, // actualizar tipo
      local_id: opcion.id, // actualizar local_id
      nombre_local: opcion.name, // actualizar nombre_local
    };

    setLocal(updated);
    updateData(updated); // guarda los cambios
  };

  if (loading) {
  return (
    <div className="mx-10 p-4">
      <h2 className="h-5 bg-gray-300 rounded w-64 mb-2 animate-pulse"></h2>
      <p className="h-3 bg-gray-200 rounded w-48 mb-4 animate-pulse"></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
      </div>
    </div>
  );
}

  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4 bg-white">
      <h2 className="font-semibold mb-2">
        Local seleccionado: {local?.identificacion_plano ?? "N/A"} –{" "}
        {local?.nombre_local ?? "N/A"}
      </h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Número de local
          </label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={local?.identificacion_plano ?? ""}
            onChange={(e) =>
              handleChange("identificacion_plano", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Descripción
          </label>
          <select
            value={local?.nombre_local ?? ""}
            onChange={(e) => {
              const opcion = opciones.find((o) => o.name === e.target.value);
              if (opcion) handleDescripcionChange(opcion);
            }}
            disabled={loadingOpciones}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione...</option>
            {opciones.map((op) => (
              <option key={op.id} value={op.name}>
                {op.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">CUI</label>
          <NumericInput
            value={local?.cui_number ?? undefined}
            onChange={(val) => handleChange("cui_number", val ?? null)}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Tipo
          </label>
          <select
            value={local?.estado ?? ""}
            onChange={(e) => handleChange("estado", e.target.value)}
            disabled={loadingOpciones}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione...</option>
            <option value="completo">Completo</option>
            <option value="incompleto">Incompleto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Protección contra robo
          </label>
          <select
            value={local?.proteccion_contra_robo ?? ""}
            onChange={(e) =>
              handleChange("proteccion_contra_robo", e.target.value)
            }
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione...</option>
            {tipo_Sistema_Contra_Robo[0].opciones.map((op) => (
              <option key={op.id} value={op.name}>
                {op.name}
              </option>
            ))}
          </select>
        </div>        
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Tipo de superficie
          </label>
          <select
            value={local?.tipo_superficie ?? ""}
            onChange={(e) => handleChange("tipo_superficie", e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccione...</option>
            <option>Cubierta </option>
            <option>Semicubierta </option>
          </select>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <label className="block text-sm font-medium text-gray-600">
            Observaciones
          </label>
          <textarea
            className="w-full text- center border rounded p-2 min-h-[120px]"
            value={observacionesTemp}
            onChange={(e) => setObservacionesTemp(e.target.value)}
            placeholder="Escriba aquí las observaciones..."
          />
          <div className="flex justify-end">
          <button
            onClick={() => {
              if (!local) return;
              const updated = { ...local, observaciones: observacionesTemp };
              setLocal(updated);
              updateData(updated);
            }}
            className=" px-4 py-2  bg-custom text-white rounded hover:bg-custom/50 transition"
          >
            Actualizar observaciones
          </button>
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="flex items-center justify-center gap-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg p-3 mt-4 shadow-md animate-pulse">
          <svg
            className="w-6 h-6 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <span className="font-semibold text-lg">Guardando...</span>
        </div>
      )}
    </div>
  );
};

export default LocalInfoEditable;
