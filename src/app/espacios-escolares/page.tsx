"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosComponent from "@/components/Forms/EstablecimientosComponent";
import PlanoComponent from "@/components/Forms/PlanoComponent";
import Navbar from "@/components/NavBar/NavBar";

export default function EspaciosEscolaresPage() {
  return (
    <div className="h-full">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">PLANILLA GENERAL</h1>
          <h4 className="text-sm">DE ESPACIOS ESCOLARES</h4>
        </div>
      </div>
      <CuiComponent label="COMPLETE UNA PLANILLA POR CADA PREDIO"/>
      <EstablecimientosComponent />
      <PlanoComponent />
    </div>
  );
}
