/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import Navbar from "@/components/NavBar/NavBar";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCui, setInstitucionId, setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HomePage() {
  const [cuiInputValue, setCuiInputValue] = useState<number | undefined>(
    undefined
  );
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const data = await establecimientosService.getAllEstablecimientos();
        setInstituciones(data);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching instituciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstituciones();
  }, []);

  const handleCuiInputChange = (cui: number | undefined) => {
    setCuiInputValue(cui);
    dispatch(setInstitucionId());
    dispatch(setCui());
  };

  const handleContinue = async () => {
    if (!cuiInputValue) return;

    try {
      const response = await axios.post("/api/relevamientos", {
        cui: cuiInputValue,
      });

      if (response.status === 200) {
        toast.success("Relevamiento creado correctamente");
        const nuevoRelevamientoId = response.data.inserted.id;
        dispatch(setRelevamientoId(nuevoRelevamientoId));
        router.push("/espacios-escolares");
      } else {
        toast.error("No se pudo crear el relevamiento");
      }
    } catch (error) {
      console.error("Error en la creación del relevamiento:", error);
      toast.error("Error al crear el relevamiento");
    }
  };

  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );

  if (loading) return <div>Cargando instituciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full overflow-hidden bg-white text-black">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">PLANILLA GENERAL</h1>
          <h4 className="text-sm">DE RELEVAMIENTO PEDAGÓGICO</h4>
        </div>
      </div>

      <CuiComponent
        label=""
        initialCui={cuiInputValue}
        onCuiInputChange={handleCuiInputChange}
        isReadOnly={false}
        sublabel=""
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md ml-10 px-4 py-2 mt-4 disabled:bg-gray-400 disabled:hover:bg-gray-400"
        disabled={!selectedInstitutionId}
        onClick={handleContinue}
      >
        Continuar
      </button>
    </div>
  );
}
