"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosPrivados from "@/components/Forms/EstablecimientosPrivados";
import RespondientesDelCuiComponent from "@/components/Forms/RespondientesDelCuiComponent";
import VisitasComponent from "@/components/Forms/VisitasComponent";
import Navbar from "@/components/NavBar/NavBar";
import { useUser } from "@/hooks/useUser";
import { useAppSelector } from "@/redux/hooks";

export default function RelevamientoPredioPage() {
  const { user, loading, error } = useUser();
  const selectedCui = useAppSelector((state) => state.espacio_escolar.cui);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full bg-white text-black">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h1>
        </div>
        <div className="w-10 h-10 ml-4 flex justify-center items-center text-black bg-slate-200 text-xl">
          <p>1</p>
        </div>
      </div>
      <CuiComponent
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN ÚNICO FORMULARIO N°1 CORRESPONDIENTE AL PREDIO QUE ESTÁ RELEVANDO"
        sublabel=""
      />
      <div className="flex mt-2 mx-10 p-2 border items-center justify-center gap-4">
        <div className=" flex gap-4 items-center justify-center w-1/2 h-1/2 border bg-slate-200 p-2 font-bold text-sm">
          <p>Censista</p>
          <p>Nombre y apellido:</p>
          <p>
            {user?.nombre} {user?.apellido}
          </p>
          <p>Dni: {user?.dni}</p>
        </div>
      </div>
      <VisitasComponent />
      <RespondientesDelCuiComponent />
      <EstablecimientosPrivados />
    </div>
  );
}
