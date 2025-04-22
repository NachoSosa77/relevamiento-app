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
import {
  setInstitucionId,
  setObservaciones,
} from "@/redux/slices/espacioEscolarSlice";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EspaciosEscolaresPage() {
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  const selectedEspacioEscolar = useAppSelector(
    (state) => state.espacio_escolar
  ); // Obtén el estado de espacio_escolar
  const relevamientoId = useAppSelector((state) => state.espacio_escolar.relevamientoId);
  //console.log("relevamientoId desde Redux:", relevamientoId);

  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("selectedInstitutionId desde Redux:", selectedInstitutionId);
  }, [selectedInstitutionId]);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(
          `/api/instituciones/${selectedInstitutionId}`
        );
        if (!response.ok) {
          throw new Error("No se pudo obtener la institución.");
        }
        const data = await response.json();
        //console.log("Institución obtenida:", data);
        setSelectedInstitution(data); // Actualiza el estado con la respuesta de la API
        dispatch(setInstitucionId(data.id));
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
    console.log(
      "Estado de Redux (espacio_escolar) actualizado:",
      selectedEspacioEscolar
    );
  }, [selectedEspacioEscolar]); // Monitorea los cambios en selectedEspacioEscolar

  const handleSaveObservacion = (observations: string) => {
    dispatch(setObservaciones(observations));
  };

  const enviarDatosEspacioEscolar = async () => {
    try {
      const payload = {
        relevamiento_id: relevamientoId, // <-- este es clave
        cui: selectedEspacioEscolar.cui,
        cantidadConstrucciones: selectedEspacioEscolar.cantidadConstrucciones,
        superficieTotalPredio: selectedEspacioEscolar.superficieTotalPredio,
        plano: selectedEspacioEscolar.plano,
        observaciones: selectedEspacioEscolar.observaciones,
      };
  
      const response = await fetch("/api/espacios_escolares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar los datos del espacio escolar.");
      }
      toast.success("Espacio escolar guardado correctamente 🎉", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push('/relevamiento-predio');
      }, 1000); // 1 segundo de espera
      console.log("Datos del espacio escolar guardados con éxito.");
      // Podés resetear el estado o mostrar confirmación visual acá
    } catch (error: any) {
      console.error("Error al enviar datos del espacio escolar:", error);
      toast.error("Hubo un error al guardar los datos.", {
        position: "top-right",
        autoClose: 3000,
      });
      setError(error.message);
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
      <ObservacionesComponent
        onSave={handleSaveObservacion}
        initialObservations={""}
      />
      {Object.keys(selectedEspacioEscolar).length > 0 && (
        <div className="flex justify-center mt-4">
          {" "}
          {/* Contenedor flex con justify-center */}
          <button
            onClick={enviarDatosEspacioEscolar}
            className="px-4 py-2 w-80 bg-blue-600 text-white rounded-md hover:bg-blue-400"
          >
            Guardar Espacio Escolar
          </button>
        </div>
      )}
    </div>
  );
}
