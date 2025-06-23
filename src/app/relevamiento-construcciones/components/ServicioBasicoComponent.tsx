"use client";

import Select from "@/components/ui/SelectComponent";
import { useEffect, useState } from "react";
import {
  almacenamientoAgua,
  provisionAgua,
  servicioAgua
} from "../config/relevamientoAgua";

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



interface ServicioBasicoProps {
  onChange: (data: ServicioBasicoData) => void;
}

export default function ServicioBasicoComponent({
  onChange,
}: ServicioBasicoProps) {
  const [provision, setProvision] = useState<{ id: string; estado: string }>({
    id: "",
    estado: "",
  });
  const [almacenamiento, setAlmacenamiento] = useState<{
    id: string;
    estado: string;
  }>({ id: "", estado: "" });
  const [alcance, setAlcance] = useState<string>("");

  // Ahora calidad solo guarda id seleccionado

  // Detalles separados para cada input dinámico
  const [tratamiento, setTratamiento] = useState<string>("");
  const [tipoTratamiento, setTipoTratamiento] = useState<string>("");
  const [controlSanitario, setControlSanitario] = useState<string>("");
  const [cantidadVeces, setCantidadVeces] = useState<string>("");

  const [listaProvision, setListaProvision] = useState<
    { id: string; estado: string }[]
  >([]);
  const [listaAlmacenamiento, setListaAlmacenamiento] = useState<
    { id: string; estado: string }[]
  >([]);
  const [listaAlcance, setListaAlcance] = useState<string[]>([]);

  useEffect(() => {
    emitirCambio();
  }, [listaProvision, listaAlmacenamiento, listaAlcance, tratamiento, tipoTratamiento, controlSanitario, cantidadVeces]);

  // Ahora listaCalidad usa CalidadItem con objeto detalle

  const getLabel = (id: string, opciones: { id: string; question: string }[]) =>
    opciones.find((opt) => opt.id === id)?.question || id;

  const emitirCambio = () => {
    onChange({
      tipo_provision: listaProvision.map((i) => getLabel(i.id, servicioAgua)),
      tipo_provision_estado: listaProvision.map((i) => {
        const necesitaEstado = servicioAgua.find(
          (opt) => opt.id === i.id
        )?.showCondition;
        return necesitaEstado ? i.estado : "";
      }),
      tipo_almacenamiento: listaAlmacenamiento.map((i) =>
        getLabel(i.id, almacenamientoAgua)
      ),
      tipo_almacenamiento_estado: listaAlmacenamiento.map((i) => {
        const necesitaEstado = almacenamientoAgua.find(
          (opt) => opt.id === i.id
        )?.showCondition;
        return necesitaEstado ? i.estado : "";
      }),
      alcance: listaAlcance.map((i) => getLabel(i, provisionAgua)),
      tratamiento,
      tipo_tratamiento: tipoTratamiento,
      control_sanitario: controlSanitario,
      cantidad_veces: cantidadVeces,
    });
  };


  const agregarAlcance = () => {
    if (alcance && !listaAlcance.includes(alcance)) {
      setListaAlcance([...listaAlcance, alcance]);
      setAlcance("");
      setTimeout(emitirCambio, 0);
    }
  };


  const quitarItem = <T,>(
    lista: T[],
    setLista: (val: T[]) => void,
    filtro: (i: T) => boolean
  ) => {
    setLista(lista.filter(filtro));
    setTimeout(emitirCambio, 0);
  };

  return (
    <div className="mt-4 space-y-2 text-sm">
      {/* Provisión */}
      <div className="p-2 border rounded-2xl shadow-lg bg-white">
        <p className="font-bold">TIPO DE PROVISIÓN DE AGUA</p>
        <div className="flex gap-2 mt-2">
          <Select
            label=""
            value={provision.id}
            onChange={(e) => setProvision({ ...provision, id: e.target.value })}
            options={servicioAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
          {(() => {
            const selected = servicioAgua.find(
              (opt) => opt.id === provision.id
            );
            if (selected?.showCondition) {
              return (
                <>
                  <p className="flex items-center">Estado</p>
                  <Select
                    label=""
                    value={provision.estado}
                    onChange={(e) =>
                      setProvision({ ...provision, estado: e.target.value })
                    }
                    options={["Bueno", "Regular", "Malo"].map((e) => ({
                      value: e,
                      label: e,
                    }))}
                  />
                </>
              );
            }
            return null;
          })()}
          <button
            onClick={() => {
              const selected = servicioAgua.find(
                (opt) => opt.id === provision.id
              );
              if (!selected) return;

              const estadoParaGuardar = selected.showCondition
                ? provision.estado
                : "";

              if (
                provision.id &&
                (estadoParaGuardar || !selected.showCondition) &&
                !listaProvision.find((i) => i.id === provision.id)
              ) {
                setListaProvision([
                  ...listaProvision,
                  { id: provision.id, estado: estadoParaGuardar },
                ]);
                setProvision({ id: "", estado: "" });
                setTimeout(emitirCambio, 0);
              }
            }}
            className="p-2 bg-custom hover:bg-custom/50 text-white rounded-lg"
          >
            Agregar
          </button>
        </div>
        {listaProvision.map((item) => (
          <div key={item.id} className="flex justify-between mt-1">
            <p>
              {getLabel(item.id, servicioAgua)}
              {item.estado ? ` - Estado: ${item.estado}` : ""}
            </p>
            <button
              className="text-red-500"
              onClick={() =>
                quitarItem(
                  listaProvision,
                  setListaProvision,
                  (i) => i.id !== item.id
                )
              }
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Almacenamiento */}
      <div className="p-2 border rounded-2xl shadow-lg bg-white">
        <p className="font-bold">TIPO DE ALMACENAMIENTO</p>
        <div className="flex gap-2 mt-2">
          <Select
            label=""
            value={almacenamiento.id}
            onChange={(e) =>
              setAlmacenamiento({ ...almacenamiento, id: e.target.value })
            }
            options={almacenamientoAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
          {(() => {
            const selected = almacenamientoAgua.find(
              (opt) => opt.id === almacenamiento.id
            );
            if (selected?.showCondition) {
              return (
                <>
                  <p className="flex items-center">Estado</p>
                  <Select
                    label=""
                    value={almacenamiento.estado}
                    onChange={(e) =>
                      setAlmacenamiento({
                        ...almacenamiento,
                        estado: e.target.value,
                      })
                    }
                    options={["Bueno", "Regular", "Malo"].map((e) => ({
                      value: e,
                      label: e,
                    }))}
                  />
                </>
              );
            }
            return null;
          })()}
          <button
            onClick={() => {
              const selected = almacenamientoAgua.find(
                (opt) => opt.id === almacenamiento.id
              );
              if (!selected) return;

              const estadoParaGuardar = selected.showCondition
                ? almacenamiento.estado
                : "";

              if (
                almacenamiento.id &&
                (estadoParaGuardar || !selected.showCondition) &&
                !listaAlmacenamiento.find((i) => i.id === almacenamiento.id)
              ) {
                setListaAlmacenamiento([
                  ...listaAlmacenamiento,
                  { id: almacenamiento.id, estado: estadoParaGuardar },
                ]);
                setAlmacenamiento({ id: "", estado: "" });
                setTimeout(emitirCambio, 0);
              }
            }}
            className="p-2 bg-custom hover:bg-custom/50 text-white rounded-lg"
          >
            Agregar
          </button>
        </div>
        {listaAlmacenamiento.map((item) => (
          <div key={item.id} className="flex justify-between mt-1">
            <p>
              {getLabel(item.id, almacenamientoAgua)}
              {item.estado ? ` - Estado: ${item.estado}` : ""}
            </p>
            <button
              className="text-red-500"
              onClick={() =>
                quitarItem(
                  listaAlmacenamiento,
                  setListaAlmacenamiento,
                  (i) => i.id !== item.id
                )
              }
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Alcance */}
      <div className="p-2 border rounded-2xl shadow-lg bg-white">
        <p className="font-bold">ALCANCE DE LA PROVISIÓN DE AGUA</p>
        <div className="flex gap-2 mt-2">
          <Select
            label=""
            value={alcance}
            onChange={(e) => setAlcance(e.target.value)}
            options={provisionAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
          <button
            onClick={agregarAlcance}
            className="p-2 bg-custom hover:bg-custom/50 text-white rounded-lg"
          >
            Agregar
          </button>
        </div>
        {listaAlcance.map((item) => (
          <div key={item} className="flex justify-between mt-1">
            <p>{getLabel(item, provisionAgua)}</p>
            <button
              className="text-red-500"
              onClick={() =>
                quitarItem(listaAlcance, setListaAlcance, (i) => i !== item)
              }
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Calidad de Agua */}
      <div className="p-2 border rounded-2xl shadow-lg bg-white">
        <p className="font-bold">CALIDAD DE AGUA PARA CONSUMO HUMANO</p>

        <div className="mt-2 space-y-2">
          <label className="block font-semibold">Tratamiento del Agua</label>
          <Select
            label=""
            value={tratamiento}
            onChange={(e) => setTratamiento(e.target.value)}
            options={[
              { value: "", label: "Seleccione" },
              {
                value: "Se realiza tratamiento potabilizador del agua",
                label: "Se realiza tratamiento potabilizador del agua",
              },
              {
                value: "No se realiza tratamiento potabilizador del agua",
                label: "No se realiza tratamiento potabilizador del agua",
              },
            ]}
          />

          {tratamiento === "Se realiza tratamiento potabilizador del agua" && (
            <>
              <label className="block font-semibold">Tipo de Tratamiento</label>
              <Select
                label=""
                value={tipoTratamiento}
                onChange={(e) => setTipoTratamiento(e.target.value)}
                options={[
                  { value: "Filtrado", label: "Filtrado" },
                  { value: "Decantación", label: "Decantación" },
                  { value: "Cloración", label: "Cloración" },
                ]}
              />
            </>
          )}

          <label className="block font-semibold">Control Sanitario del Agua</label>
          <Select
            label=""
            value={controlSanitario}
            onChange={(e) => setControlSanitario(e.target.value)}
            options={[
              { value: "", label: "Seleccione" },
              {
                value: "Se realiza control sanitario de la calidad del agua",
                label: "Se realiza control sanitario de la calidad del agua",
              },
              {
                value: "No se realiza control sanitario de la calidad del agua",
                label: "No se realiza control sanitario de la calidad del agua",
              },
            ]}
          />

          {controlSanitario ===
            "Se realiza control sanitario de la calidad del agua" && (
              <>
                <label className="block font-semibold">
                  Cantidad de veces por año
                </label>
                <input
                  type="number"
                  min="1"
                  className="border rounded px-2 py-1 w-20"
                  value={cantidadVeces}
                  onChange={(e) => setCantidadVeces(e.target.value)}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
}
