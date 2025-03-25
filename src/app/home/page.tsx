/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import Navbar from "@/components/NavBar/NavBar";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService"; // Importa el servicio
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [cuiInputValue, setCuiInputValue] = useState<number | undefined>(undefined); // Valor del input CUI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]); // Todas las instituciones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const data = await establecimientosService.getAllEstablecimientos();
        //console.log(data)
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
  };

  
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  
  console.log("ID HomePage:", selectedInstitutionId);
  
  if (loading) {
    return <div>Cargando instituciones...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        label={""}
        initialCui={cuiInputValue}
        onCuiInputChange={handleCuiInputChange} // Pasa la función para actualizar el CUI
        isReadOnly={false}
        sublabel=""
      />

      <Link href="/espacios-escolares">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md ml-10 px-4 py-2 mt-4 disabled:bg-gray-400 disabled:hover:bg-gray-400"
          disabled={!selectedInstitutionId}
        >
          Continuar
        </button>
      </Link>
    </div>
  );
}
