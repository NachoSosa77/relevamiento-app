/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AreasExterioresComponent from "@/components/Forms/AreasExterioresComponent";
import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosComponent from "@/components/Forms/EstablecimientosComponent";
import LocalesPorConstruccion from "@/components/Forms/LocalesPorConstruccion";
import PlanoComponent from "@/components/Forms/PlanoComponent";
import Navbar from "@/components/NavBar/NavBar";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setInstitucionSeleccionada } from "@/redux/slices/institucionSlice";
import { useEffect, useState } from "react";

export default function EspaciosEscolaresPage() {
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  const selectedEspacioEscolar = useAppSelector(
    (state) => state.espacio_escolar
  ); // Obtén el estado de espacio_escolar
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();


  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`/api/instituciones/${selectedInstitutionId}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la institución.");
        }
        const data = await response.json();
        setSelectedInstitution(data); // Actualiza el estado con la respuesta de la API
        dispatch(setInstitucionSeleccionada(selectedInstitutionId));
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching institution:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedInstitutionId) {
      fetchInstitution();
    }
  }, [dispatch, selectedInstitutionId]);

  useEffect(() => {
    console.log("Estado de Redux (espacio_escolar) actualizado:", selectedEspacioEscolar);
  }, [selectedEspacioEscolar]); // Monitorea los cambios en selectedEspacioEscolar

  const handleSaveObservacion = async (observations: string, contextId: string | number) => {
    try {
      const response = await fetch("/api/observaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacion: observations, espacio_escolar_id: contextId }),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar la observación");
      }
  
      console.log("Observación guardada con éxito");
    } catch (error) {
      console.error(error);
    }
  };
  

  if (loading) {
    return <div>Cargando institución...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedInstitution) {
    return <div>No se ha seleccionado ninguna institución.</div>;
  }

  return (
    <div className="h-screen bg-white text-black text-sm">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">PLANILLA GENERAL</h1>
          <h4 className="text-sm">DE ESPACIOS ESCOLARES</h4>
        </div>
      </div>

      <CuiComponent
        label="COMPLETE UNA PLANILLA POR CADA PREDIO"
        isReadOnly={true}
        initialCui={selectedInstitution.cui}
        onCuiInputChange={() => {}}
        sublabel=""
      />

      <EstablecimientosComponent />
      <PlanoComponent />
      <AreasExterioresComponent />
      <LocalesPorConstruccion />
      <ObservacionesComponent onSave={handleSaveObservacion} contextId={1} />
    </div>
  );
}