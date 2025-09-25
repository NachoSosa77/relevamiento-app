/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AreasExterioresComponent from "@/components/Forms/AreasExterioresComponent";
import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosComponent from "@/components/Forms/EstablecimientosComponent";
import LocalesPorConstruccion from "@/components/Forms/LocalesPorConstruccion";
import PlanoComponent from "@/components/Forms/PlanoComponent";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import Spinner from "@/components/ui/Spinner";
import { useCuiFromRelevamientoId } from "@/hooks/useCuiByRelevamientoId";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setInstitucionId,
  setObservaciones,
} from "@/redux/slices/espacioEscolarSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EspaciosEscolaresPage() {
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  const selectedEspacioEscolar = useAppSelector(
    (state) => state.espacio_escolar
  );
  const relevamientoId = useRelevamientoId();
  const selectedCui = useCuiFromRelevamientoId(relevamientoId);

  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [observacionesDB, setObservacionesDB] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 🔹 Resetear Redux y traer observaciones guardadas
  useEffect(() => {
    dispatch(setObservaciones("")); // reset redux
    const fetchEspacioEscolar = async () => {
      try {
        const res = await fetch(`/api/espacios_escolares/${relevamientoId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.observaciones) {
            setObservacionesDB(data.observaciones);
            dispatch(setObservaciones(data.observaciones));
          }
        }
      } catch (err) {
        console.error("Error cargando espacio escolar:", err);
      }
    };

    if (relevamientoId) {
      fetchEspacioEscolar();
    }
  }, [relevamientoId, dispatch]);


  // 🔹 Fetch de institución
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
        setSelectedInstitution(data);
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

  const handleSaveObservacion = (observations: string) => {
    dispatch(setObservaciones(observations));
  };

  const enviarDatosEspacioEscolar = async () => {
  setIsSubmitting(true);

  const selectedAreaIds = selectedEspacioEscolar.areasExteriores.map(a => a.id);

  try {
    const payload = {
      relevamiento_id: relevamientoId,
      cui: selectedCui,
      cantidadConstrucciones: selectedEspacioEscolar.cantidadConstrucciones,
      superficieTotalPredio: selectedEspacioEscolar.superficieTotalPredio,
      observaciones: selectedEspacioEscolar.observaciones, // 🔹 siempre de Redux
      areasExteriores: selectedAreaIds,
    };

    // 🔹 Solo usamos POST, que hace crear o actualizar
    const response = await fetch("/api/espacios_escolares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      router.push("/relevamiento-predio");
    }, 1000);

  } catch (error: any) {
    console.error("Error al enviar datos del espacio escolar:", error);
    toast.error("Hubo un error al guardar los datos.", {
      position: "top-right",
      autoClose: 3000,
    });
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" bg-white text-black text-sm mt-28 w-full">
      <div className="flex justify-between mt-20 mb-8 mx-8">
        <div className="flex items-center">
          <h1 className="font-bold">Relevamiento N° {relevamientoId}</h1>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="font-bold">PLANILLA GENERAL</h1>
          <h4 className="text-sm">DE RELEVAMIENTO PEDAGÓGICO</h4>
        </div>
      </div>

      {loading && (
        <div className=" flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <CuiComponent
        label="COMPLETE UNA PLANILLA POR CADA PREDIO"
        isReadOnly={true}
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        sublabel=""
        institucionActualId={selectedInstitutionId}
      />

      <EstablecimientosComponent />
      <PlanoComponent />
      <LocalesPorConstruccion />
      <AreasExterioresComponent />
      <ObservacionesComponent
        onSave={handleSaveObservacion}
        initialObservations={
          observacionesDB || selectedEspacioEscolar.observaciones || ""
        }
      />
      {Object.keys(selectedEspacioEscolar).length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={enviarDatosEspacioEscolar}
            className="px-4 py-2 w-80 bg-custom text-white rounded-md hover:bg-custom/50 flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Espacio Escolar"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
