/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CuiLocalesComponent from "@/components/Forms/dinamicForm/CuiLocalesComponent";
import Spinner from "@/components/ui/Spinner";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

export default function RelevamientoLocalesPage() {
  const selectedInstitutionsRedux = useAppSelector(
    (state) => state.espacio_escolar.institucionesSeleccionadas
  );
  const relevamientoId = useRelevamientoId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);

  useEffect(() => {
    if (selectedInstitutionsRedux && selectedInstitutionsRedux.length > 0) {
      setSelectedInstitution(selectedInstitutionsRedux[0]); // suponemos que se usa la primera
      setLoading(false);
    } else {
      setError("No se encontró ninguna institución seleccionada.");
      setLoading(false);
    }
  }, [selectedInstitutionsRedux]);

  /* 

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedInstitution) {
    return <div>No se ha seleccionado ninguna institución.</div>;
  } */

  return (
    <div className="mt-36 bg-white text-black text-sm">
      <div className="flex justify-between items-center mt-20 mb-8 mx-8">
        <div className="flex items-center">
          <h1 className="font-bold">Relevamiento N° {relevamientoId}</h1>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold">GESTIÓN ESTATAL</h1>
          <h4 className="text-sm">
            FORMULARIO DE RELEVAMIENTO DE LOCALES PEDAGÓGICOS Y DE SERVICIOS
          </h4>
        </div>
        <div className="w-10 h-10 rounded-full ml-4 flex justify-center items-center text-white bg-custom font-semibold text-xl">
          <p>3</p>
        </div>
      </div>

      {loading && (
        <div className="items-center justify-center">
          <Spinner />
          Cargando locales...
        </div>
      )}

      <CuiLocalesComponent
        onLocalSelected={() => {}}
        isReadOnly={false}
        label="COMPLETE UN FORMULARIO EXCLUSIVAMENTE POR CADA LOCAL."
        sublabel="Transcriba de la hoja de ruta el Número de CUI, transcriba del plano los números de construcción, planta y local."
      />
    </div>
  );
}
