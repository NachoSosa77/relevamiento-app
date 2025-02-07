"use client";

import { Colegios } from "@/app/lib/Colegios";
import { Establecimientos } from "@/interfaces/Establecimientos";
import { useState } from "react";
import Select from "../ui/SelectComponent";

export default function EstablecimientosComponent() {
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<
    number | null
  >(null);
  const establecimientos: Establecimientos[] = Colegios;
  console.log(establecimientos, "establecimientos");

  const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEstablecimiento(Number(event.target.value));
  };
  const selectedColegio = establecimientos.find(
    (establecimientos) => establecimientos.id === selectedEstablecimiento
  );

  return (
    <div className="mx-10 mt-4">
      <div className="flex mt-2 p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>B</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            ESTABLECIMIENTOS EDUCATIVOS
          </p>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta el domicilio postal del CUE-Anexos del o
          los directivos respondientes. Si es necesario utilice la columna
          Referencia para especificar el domicilio.
        </p>
      </div>
      <div className="flex mt-2 gap-2 items-center">
        <div className="flex flex-row gap-4">
          <Select
            label={"Establecimiento"}
            value={selectedEstablecimiento?.toString() || ""}
            options={establecimientos.map((establecimiento) => ({
              value: establecimiento.id,
              label: establecimiento.nombre,
            }))}
            onChange={handleSelecteChange}
          />
          {selectedColegio && (
            <div className="flex flex-row gap-8 text-sm mx-6 whitespace-nowrap items-center justify-between">
              <div className="flex flex-col">
                <p className="font-bold">Calle</p>
                <p className="border-2 rounded p-2">{selectedColegio.calle}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Número</p>
                <p className="border-2 rounded p-2">{selectedColegio.numero}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Referencia</p>
                <p className="border-2 rounded p-2">
                  {selectedColegio.referencia}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Provincia</p>
                <p className="border-2 rounded p-2">
                  {selectedColegio.provincia}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Departamento</p>
                <p className="border-2 rounded p-2">
                  {selectedColegio.departamento || "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Localidad/Paraje</p>
                <p className="border-2 rounded p-2">
                  {selectedColegio.localidad}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
