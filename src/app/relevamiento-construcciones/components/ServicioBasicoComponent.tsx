"use client";

import Select from "@/components/ui/SelectComponent";
import { useState } from "react";
import {
  almacenamientoAgua,
  provisionAgua,
  servicioAgua,
} from "../config/relevamientoAgua";

interface ServicioBasicoData {
  tipo_provision: string[];
  tipo_provision_estado: string[];
  tipo_almacenamiento: string[];
  tipo_almacenamiento_estado: string[];
  alcance: string[];
  tratamiento: string;
  tipo_tratamiento: string;
  control_sanitario: string;
  cantidad_veces: string;
}
interface ServicioBasicoProps {
  value: ServicioBasicoData;
  onChange: (data: ServicioBasicoData) => void;
}

export default function ServicioBasicoComponent({ value, onChange }: ServicioBasicoProps) {
  const [provisionSeleccionada, setProvisionSeleccionada] = useState<{ id: string; estado: string }>({ id: "", estado: "" });
  const [almacenamientoSeleccionado, setAlmacenamientoSeleccionado] = useState<{ id: string; estado: string }>({ id: "", estado: "" });
  const [alcanceSeleccionado, setAlcanceSeleccionado] = useState<string>("");

  const getLabel = (id: string, opciones: { id: string; question: string }[]) =>
    opciones.find((opt) => opt.id === id)?.question || id;

  const agregarProvision = () => {
    const label = getLabel(provisionSeleccionada.id, servicioAgua);
    if (!label || value.tipo_provision.includes(label)) return;

    onChange({
      ...value,
      tipo_provision: [...value.tipo_provision, label],
      tipo_provision_estado: [...value.tipo_provision_estado, provisionSeleccionada.estado || ""],
    });
    setProvisionSeleccionada({ id: "", estado: "" });
  };

  const quitarProvision = (index: number) => {
    const nuevaProvision = [...value.tipo_provision];
    const nuevaEstado = [...value.tipo_provision_estado];
    nuevaProvision.splice(index, 1);
    nuevaEstado.splice(index, 1);
    onChange({ ...value, tipo_provision: nuevaProvision, tipo_provision_estado: nuevaEstado });
  };

  const agregarAlmacenamiento = () => {
    const label = getLabel(almacenamientoSeleccionado.id, almacenamientoAgua);
    if (!label || value.tipo_almacenamiento.includes(label)) return;

    onChange({
      ...value,
      tipo_almacenamiento: [...value.tipo_almacenamiento, label],
      tipo_almacenamiento_estado: [...value.tipo_almacenamiento_estado, almacenamientoSeleccionado.estado || ""],
    });
    setAlmacenamientoSeleccionado({ id: "", estado: "" });
  };

  const quitarAlmacenamiento = (index: number) => {
    const nuevo = [...value.tipo_almacenamiento];
    const nuevoEstado = [...value.tipo_almacenamiento_estado];
    nuevo.splice(index, 1);
    nuevoEstado.splice(index, 1);
    onChange({ ...value, tipo_almacenamiento: nuevo, tipo_almacenamiento_estado: nuevoEstado });
  };

  const agregarAlcance = () => {
    const label = getLabel(alcanceSeleccionado, provisionAgua);
    if (!label || value.alcance.includes(label)) return;

    onChange({ ...value, alcance: [...value.alcance, label] });
    setAlcanceSeleccionado("");
  };

  const quitarAlcance = (index: number) => {
    const nuevo = [...value.alcance];
    nuevo.splice(index, 1);
    onChange({ ...value, alcance: nuevo });
  };

  return (
    <div className="space-y-4">
      {/* Provisión */}
      <div className="border rounded-xl p-4">
        <p className="font-bold mb-2">Tipo de provisión de agua</p>
        <div className="flex gap-2">
          <Select
            label=""
            value={provisionSeleccionada.id}
            onChange={(e) => setProvisionSeleccionada({ ...provisionSeleccionada, id: e.target.value })}
            options={servicioAgua.map(opt => ({ value: opt.id, label: opt.question }))}
          />
          {servicioAgua.find(opt => opt.id === provisionSeleccionada.id)?.showCondition && (
            <Select
              label="Estado"
              value={provisionSeleccionada.estado}
              onChange={(e) => setProvisionSeleccionada({ ...provisionSeleccionada, estado: e.target.value })}
              options={["Bueno", "Regular", "Malo"].map(e => ({ value: e, label: e }))}
            />
          )}
          <button className="bg-custom text-white px-2 rounded" onClick={agregarProvision}>Agregar</button>
        </div>
        {value.tipo_provision.map((item, index) => (
          <div key={index} className="flex justify-between mt-1">
            <p>{item}{value.tipo_provision_estado[index] && ` - Estado: ${value.tipo_provision_estado[index]}`}</p>
            <button onClick={() => quitarProvision(index)} className="text-red-500">Quitar</button>
          </div>
        ))}
      </div>

      {/* Almacenamiento */}
      <div className="border rounded-xl p-4">
        <p className="font-bold mb-2">Tipo de almacenamiento</p>
        <div className="flex gap-2">
          <Select
            label=""
            value={almacenamientoSeleccionado.id}
            onChange={(e) => setAlmacenamientoSeleccionado({ ...almacenamientoSeleccionado, id: e.target.value })}
            options={almacenamientoAgua.map(opt => ({ value: opt.id, label: opt.question }))}
          />
          {almacenamientoAgua.find(opt => opt.id === almacenamientoSeleccionado.id)?.showCondition && (
            <Select
              label="Estado"
              value={almacenamientoSeleccionado.estado}
              onChange={(e) => setAlmacenamientoSeleccionado({ ...almacenamientoSeleccionado, estado: e.target.value })}
              options={["Bueno", "Regular", "Malo"].map(e => ({ value: e, label: e }))}
            />
          )}
          <button className="bg-custom text-white px-2 rounded" onClick={agregarAlmacenamiento}>Agregar</button>
        </div>
        {value.tipo_almacenamiento.map((item, index) => (
          <div key={index} className="flex justify-between mt-1">
            <p>{item}{value.tipo_almacenamiento_estado[index] && ` - Estado: ${value.tipo_almacenamiento_estado[index]}`}</p>
            <button onClick={() => quitarAlmacenamiento(index)} className="text-red-500">Quitar</button>
          </div>
        ))}
      </div>

      {/* Alcance */}
      <div className="border rounded-xl p-4">
        <p className="font-bold mb-2">Alcance de la provisión</p>
        <div className="flex gap-2">
          <Select
            label=""
            value={alcanceSeleccionado}
            onChange={(e) => setAlcanceSeleccionado(e.target.value)}
            options={provisionAgua.map(opt => ({ value: opt.id, label: opt.question }))}
          />
          <button className="bg-custom text-white px-2 rounded" onClick={agregarAlcance}>Agregar</button>
        </div>
        {value.alcance.map((item, index) => (
          <div key={index} className="flex justify-between mt-1">
            <p>{item}</p>
            <button onClick={() => quitarAlcance(index)} className="text-red-500">Quitar</button>
          </div>
        ))}
      </div>

      {/* Tratamiento, control, etc. */}
      <div className="border rounded-xl p-4 space-y-2">
        <p className="font-bold mb-2">Calidad del agua</p>

        <Select
          label="Tratamiento del agua"
          value={value.tratamiento || ""}
          onChange={(e) => onChange({ ...value, tratamiento: e.target.value })}
          options={[
            { value: "", label: "Seleccione" },
            { value: "Se realiza tratamiento potabilizador del agua", label: "Se realiza tratamiento potabilizador del agua" },
            { value: "No se realiza tratamiento potabilizador del agua", label: "No se realiza tratamiento potabilizador del agua" },
          ]}
        />

        {value.tratamiento === "Se realiza tratamiento potabilizador del agua" && (
          <Select
            label="Tipo de tratamiento"
            value={value.tipo_tratamiento || ""}
            onChange={(e) => onChange({ ...value, tipo_tratamiento: e.target.value })}
            options={[
              { value: "Filtrado", label: "Filtrado" },
              { value: "Decantación", label: "Decantación" },
              { value: "Cloración", label: "Cloración" },
            ]}
          />
        )}

        <Select
          label="Control sanitario"
          value={value.control_sanitario || ""}
          onChange={(e) => onChange({ ...value, control_sanitario: e.target.value })}
          options={[
            { value: "", label: "Seleccione" },
            { value: "Se realiza control sanitario de la calidad del agua", label: "Se realiza control sanitario de la calidad del agua" },
            { value: "No se realiza control sanitario de la calidad del agua", label: "No se realiza control sanitario de la calidad del agua" },
          ]}
        />

        {value.control_sanitario === "Se realiza control sanitario de la calidad del agua" && (
          <input
            type="number"
            min="1"
            className="border px-2 py-1 rounded"
            value={value.cantidad_veces || ""}
            onChange={(e) => onChange({ ...value, cantidad_veces: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
