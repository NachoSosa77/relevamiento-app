"use client";

import { Locales } from "@/app/lib/Locales";
import { TipoLocales } from "@/interfaces/Locales";
import { useState } from "react";
import AlphanumericInput from "../ui/AlphanumericInput";
import Select from "../ui/SelectComponent";

export default function LocalesPorConstruccion() {
  const [selectLocales, setSelectLocales] = useState<number | null>(null);
  const locales: TipoLocales[] = Locales;
  console.log(locales, "locales");
  const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectLocales(Number(event.target.value));
  };
  /* const selectedLocales = locales.find(
    (locales) => locales.id === setSelectLocales
  ); */

  return (
    <div className="mx-10">
      <div className="flex mt-2 p-4 border items-center justify-between">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black text-xl">
          <p>5</p>
        </div>
        <div className="justify-center">
          <p className="text-lg font-bold ml-4">LOCALES POR CONSTRUCCIÓN</p>
        </div>
        <div className="flex flex-col p-2 text-xs text-gray-400 bg-gray-100 border justify-end">
          <p className="font-semibold text-center">Tipo de locales</p>
          <p>
            1-Aula común 2-Sala de nivel inicial 3-Aula especial 4-Laboratorio
            5-Taller 6-Gimnasio 7-Piscina cubierta
          </p>
          <p>
            8-Biblioteca/Centro de recursos 9-Sala de estudio 10-Salón de
            actos/Aula magna 11-Auitorio/Teatro
          </p>
          <p>
            12-Salón de usos múltiples/patio cubierto 13-Otro local pedagógico
            14-Oficina 15-Sala de reuniones
          </p>
          <p>
            16-Local para funciones de apoyo 17-Comedor 18-Cocina 19-Office
            20-Cantina 21-Sanitarios Alumnos
          </p>
          <p>
            22-Sanitarios docentes/personal 23-Vestuario 24-Alojamiento
            25-Deposito/Despensa 26-Sala de maquinas
          </p>
          <p>
            27-Hall/Acceso 28-Circulación 29-Porch/atrio 30-Otro (Indique)
            31-Sin destino especifico
          </p>
        </div>
        {/* <div className="ml-auto">
                <AlphanumericInput
                    subLabel=""
                    label={""}
                    value={""}
                    onChange={() => set""()}
                />
                </div> */}
      </div>
      {/* Encabezado de tabla */}
      <form action="">
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              N° de Construcción:
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie cubierta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie semicubierta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie total
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-sm font-bold bg-gray-100 p-2 rounded-md flex-nowrap"
            >
              Cargar Información
            </button>
          </div>
        </div>
      </form>
      {/* Cuerpo tabla */}
      <form action="">
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Identificación en el plano
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="L"
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              N° de planta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Tipo
            </p>
            <div className="mt-2 w-full">
              <Select
                label={""}
                value={selectLocales?.toString() || ""}
                options={locales.map((local)=>({
                  value: local.id,
                  label: local.name,
                }))}                
                onChange={handleSelecteChange}
              ></Select>
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Local sin uso
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="m²"
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-sm font-bold bg-gray-100 p-2 rounded-md flex-nowrap"
            >
              Cargar Información
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
