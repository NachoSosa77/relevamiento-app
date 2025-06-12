"use client";

import { establecimientosHeader } from "@/app/relevamiento-predio/config/establecimientosHeader";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useMemo } from "react";
import ReusableTable from "../Table/TableReutilizable";

interface EstablecimientosComponentProps {
  selectedInstitutions: InstitucionesData[];
}

const EstablecimientosEducativos: React.FC<EstablecimientosComponentProps> = ({
  selectedInstitutions,
}) => {
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
    <div className="overflow-x-auto">
      <ReusableTable
        data={institutionsToDisplay}
        columns={establecimientosHeader}
      />
    </div>
  );
};

export default EstablecimientosEducativos;
