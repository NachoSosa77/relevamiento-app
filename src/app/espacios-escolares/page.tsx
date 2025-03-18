"use client";

import AreasExterioresComponent from "@/components/Forms/AreasExterioresComponent";
import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosComponent from "@/components/Forms/EstablecimientosComponent";
import LocalesPorConstruccion from "@/components/Forms/LocalesPorConstruccion";
import PlanoComponent from "@/components/Forms/PlanoComponent";
import Navbar from "@/components/NavBar/NavBar";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";

export default function EspaciosEscolaresPage() {
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores

  console.log("SELECTED INSTITUCION", selectedInstitution);

  useEffect(() => {
    const storedInstitution = localStorage.getItem("selectedInstitution");
    console.log("storedInstitution", storedInstitution);
    if (storedInstitution) {
      try {
        const parsedInstitution = JSON.parse(storedInstitution);
        if (
          typeof parsedInstitution === "object" &&
          parsedInstitution !== null
        ) {
          console.log("parsedInstitution", parsedInstitution);
          setSelectedInstitution(parsedInstitution);
          setLoading(false); // ¡IMPORTANTE!
        } else {
          console.warn(
            "Datos incorrectos en localStorage para selectedInstitution"
          );
          setError("Error al cargar la institución."); // Establece el error
          setLoading(false); // ¡IMPORTANTE!
        }
      } catch (error) {
        console.error(
          "Error al parsear selectedInstitution desde localStorage:",
          error
        );
        setError("Error al cargar la institución."); // Establece el error
        setLoading(false); // ¡IMPORTANTE!
      }
    } else {
      setLoading(false); // Si no hay nada en localStorage, no hay carga
    }
  }, []);

  if (loading) {
    return <div>Cargando institución...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedInstitution) {
    return <div>No se ha seleccionado ninguna institución.</div>; // Mensaje si no hay selección
  }

  return (
    <div className="h-screen bg-white text-black">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">PLANILLA GENERAL</h1>
          <h4 className="text-sm">DE ESPACIOS ESCOLARES</h4>
        </div>
      </div>
      <CuiComponent
        label="COMPLETE UNA PLANILLA POR CADA PREDIO"
        selectedInstitution={selectedInstitution}
        isReadOnly={true}
        onInstitutionSelected={() => {}} // Función vacía
        initialCui={selectedInstitution.cui} // O un valor inicial si lo tienes
        onCuiInputChange={() => {}} // Función vacía
        sublabel=""
      />
      <EstablecimientosComponent selectedInstitution={selectedInstitution} />
      <PlanoComponent />
      <AreasExterioresComponent />
      <LocalesPorConstruccion />
      <ObservacionesComponent/>
    </div>
  );
}
