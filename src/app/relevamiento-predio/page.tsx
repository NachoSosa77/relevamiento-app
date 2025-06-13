"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosPrivados from "@/components/Forms/EstablecimientosPrivados";
import RespondientesDelCuiComponent from "@/components/Forms/RespondientesDelCuiComponent";
import VisitasComponent from "@/components/Forms/VisitasComponent";
import Spinner from "@/components/ui/Spinner";
import { useUser } from "@/hooks/useUser";
import { useAppSelector } from "@/redux/hooks";

export default function RelevamientoPredioPage() {
  const { user, loading, error } = useUser();
  const selectedCui = useAppSelector((state) => state.espacio_escolar.cui);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full bg-white text-black mt-28">
      <div className="flex justify-center mt-20 mb-8 mx-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h1>
        </div>
        <div className="w-10 h-10 rounded-full ml-4 flex justify-center items-center text-white bg-custom text-xl">
          <p>1</p>
        </div>
      </div>
            {
        loading && (
          <div className="flex items-center justify-center"><Spinner />Cargando instituciones...</div>
        )
      }

      <CuiComponent
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN ÚNICO FORMULARIO N°1 CORRESPONDIENTE AL PREDIO QUE ESTÁ RELEVANDO"
        sublabel=""
      />
      <div className="mx-10 mt-4">
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md p-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center w-full sm:w-auto justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1 text-gray-700 text-sm font-medium shadow-sm w-full sm:w-[400px]">
              <p className="text-custom font-semibold text-xs uppercase tracking-wide">
                Censista
              </p>
              <div className="flex gap-2">
                <span className="text-gray-500">Nombre y apellido:</span>
                <span>
                  {user?.nombre} {user?.apellido}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">DNI:</span>
                <span>{user?.dni}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VisitasComponent />
      <RespondientesDelCuiComponent />
      <EstablecimientosPrivados />
    </div>
  );
}
