/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import TablaRelevamientos from "@/components/Table/TablaRelevamientos";
import { useUser } from "@/hooks/useUser";
import { Relevamiento } from "@/interfaces/Relevamiento";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetArchivos } from "@/redux/slices/archivoSlice";
import {
  setCui,
  setInstitucionId,
  setRelevamientoId,
} from "@/redux/slices/espacioEscolarSlice";
import { relevamientoService } from "@/services/relevamientoService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function HomePage() {
  const [cuiInputValue, setCuiInputValue] = useState<number | undefined>(
    undefined
  );
  const [relevamientos, setRelevamientos] = useState<Relevamiento[]>([]);
  const [botonCrearHabilitado, setBotonCrearHabilitado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useUser();

  const handleCuiInputChange = (cui: number | undefined) => {
    setCuiInputValue(cui);
    dispatch(setInstitucionId());
    dispatch(setCui());
  };

  const handleNuevoRelevamiento = async () => {
    if (!cuiInputValue || !user?.email || !user?.id) return;

    try {
      const data = await relevamientoService.createRelevamiento({
        cui: cuiInputValue,
        created_by: user.email,
        usuario_id: user.id,
        email: user.email,
      });

      // Acá accedés directamente a lo que devolvés en el endpoint
      const nuevoRelevamientoId = data.inserted.id;
      dispatch(resetArchivos());

      toast.success("Relevamiento creado correctamente");
      dispatch(setRelevamientoId(nuevoRelevamientoId));
      sessionStorage.setItem("relevamientoId", String(nuevoRelevamientoId));
      router.push("/espacios-escolares");
    } catch (error) {
      console.error("Error en la creación del relevamiento:", error);
      toast.error("Error al crear el relevamiento");
    }
  };

  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full mt-8 overflow-hidden bg-white text-black text-sm">
      <div className="flex justify-center mt-20 mb-8 mx-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-custom">
            FORMULARIO GENERAL DE RELEVAMIENTO PEDAGÓGICO
          </h1>
        </div>
      </div>

      <CuiComponent
        label=""
        initialCui={cuiInputValue}
        onCuiInputChange={handleCuiInputChange}
        isReadOnly={false}
        sublabel=""
        onValidInstitutionSelected={(valido) => setBotonCrearHabilitado(valido)}
      />

      <button
        className="bg-green-600 hover:bg-green-700 text-white rounded-md ml-10 px-4 py-2 mt-4 disabled:bg-gray-400 disabled:hover:bg-gray-400"
        disabled={!botonCrearHabilitado}
        onClick={handleNuevoRelevamiento} // Función para crear un nuevo relevamiento
      >
        Nuevo Relevamiento
      </button>

      <div>
        <TablaRelevamientos />
      </div>
    </div>
  );
}
