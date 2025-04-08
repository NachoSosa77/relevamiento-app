"use client";


import { establecimientosHeader } from "@/app/relevamiento-predio/config/establecimientosHeader";
import { InstitucionesData } from "@/interfaces/Instituciones"; // Importa la interfaz
import { useMemo } from "react";
import ReusableTable from "../Table/TableReutilizable";

interface EstablecimientosComponentProps {
  selectedInstitutions: InstitucionesData[];
}
const EstablecimientosPredio: React.FC<EstablecimientosComponentProps> = ({selectedInstitutions,}) => {
  
  const institutionsToDisplay = useMemo(() => {
    return selectedInstitutions ?? [];
  }, [selectedInstitutions]); 

  if (!selectedInstitutions) {
    // Manejar el caso en que selectedInstitution es null
    return (
      <div className="mx-10 mt-4">
        <p>No se ha seleccionado ninguna institución.</p>
      </div>
    );
  }

  return (
    <div className="mx-10 mt-4 text-sm">
      <div className="flex mt-2 border items-center">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black font-bold">
          <p>C</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            ESTABLECIMIENTOS QUE FUNCIONAN EN EL PREDIO
          </p>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta la denominación de los establecimientos
          educativos que funcionan en el predio y el Número de CUE-Anexo de cada
          uno de ellos. En caso de que el directivo mencione un CUE-Anexo
          usuario que no está consignado en la Hoja de ruta, se deberá agregar,
          completando los datos correspondientes.
        </p>
      </div>
       <ReusableTable
        data={institutionsToDisplay}
        columns={establecimientosHeader}
      />
    </div>
  );
};

export default EstablecimientosPredio;
