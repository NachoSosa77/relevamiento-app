"use client";

import { establecimientosHeader } from "@/app/relevamiento-predio/config/establecimientosHeader";
import { InstitucionesData } from "@/interfaces/Instituciones"; // Importa la interfaz
import { useMemo } from "react";
import ReusableTable from "../Table/TableReutilizable";

interface EstablecimientosComponentProps {
  selectedInstitutions: InstitucionesData[];
}
const EstablecimientosPredio: React.FC<EstablecimientosComponentProps> = ({
  selectedInstitutions,
}) => {
  const institutionsToDisplay = useMemo(() => {
    return selectedInstitutions ?? [];
  }, [selectedInstitutions]);

  if (!selectedInstitutions) {
    // Manejar el caso en que selectedInstitution es null
    return (
      <div className="mx-8 my-6 border rounded-2xl">
        <p>No se ha seleccionado ninguna institución.</p>
      </div>
    );
  }

  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
            <p>C</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              ESTABLECIMIENTOS QUE FUNCIONAN EN EL PREDIO
            </p>
          </div>
        </div>
        <div className="flex">
          <p className="p-2 text-xs rounded text-white bg-gray-700">
            Transcriba de la hoja de ruta la denominación de los
            establecimientos educativos que funcionan en el predio y el número
            de CUE-Anexo de cada uno de ellos. En caso de que el directivo
            mencione un CUE-Anexo usuario que no esté consignado en la hoja de
            ruta, deberá agregarse, completando los datos correspondientes.
          </p>
        </div>
        <ReusableTable
          data={institutionsToDisplay}
          columns={establecimientosHeader}
        />
      </div>
    </div>
  );
};

export default EstablecimientosPredio;
