/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CuiLocalesComponent from "@/components/Forms/dinamicForm/CuiLocalesComponent";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

export default function RelevamientoLocalesPage() {
  const selectedInstitutionsRedux = useAppSelector(
    (state) => state.espacio_escolar.institucionesSeleccionadas
  );

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

  if (loading) {
    return <div>Cargando institución...</div>;
  } /* 

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedInstitution) {
    return <div>No se ha seleccionado ninguna institución.</div>;
  } */

  return (
    <div className="mt-36 bg-white text-black text-sm">
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">GESTIÓN ESTATAL</h1>
          <h4 className="text-sm">
            FORMULARIO DE RELEVAMIENTO DE LOCALES PEDAGÓGICOS Y DE SERVICIOS
          </h4>
        </div>
        <div className="w-10 h-10 rounded-full ml-4 flex justify-center items-center text-white bg-custom font-semibold text-xl">
          <p>3</p>
        </div>
      </div>

      <CuiLocalesComponent
        onLocalSelected={(local) => console.log(local)}
        isReadOnly={false}
        label="COMPLETE UN FORMULARIO EXCLUSIVAMENTE POR CADA LOCAL CON FUNCIONES PEDAGOGICAS (AULA COMUN, SALA DE NIVEL INICIAL AULA ESPECIAL, LABORATORIO, TALLER, GIMNASIO, PISCINA CUBIERTA, BIBLIOTECA/CENTRO DE RECURSOS, SALA DE ESTUDIO, SALON DE USOS MULTIPLES/PATIO CUBIERTO, OTRO LOCAL PEDAGOGICO) Y DE SERVICIOS (EXCLUSIVAMENTE COMEDOR, COCINA, OFFICE, SANITARIOS DE ALUMNOS, SANITARIOS DE DOCENTES/PERSONAL)."
        sublabel="Transcriba de la hoja de ruta el Número de CUI, transcriba del plano los números de construcción, planta y local."
      />
    </div>
  );
}
