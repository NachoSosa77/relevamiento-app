"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosPrivados from "@/components/Forms/EstablecimientosPrivados";
import RespondientesDelCuiComponent from "@/components/Forms/RespondientesDelCuiComponent";
import VisitasComponent from "@/components/Forms/VisitasComponent";
import Navbar from "@/components/NavBar/NavBar";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";

export default function RelevamientoPredioPage() {
  const [selectedInstitution, setSelectedInstitution] = useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores

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
          setSelectedInstitution(parsedInstitution);
        } else {
          console.warn(
            "Datos incorrectos en localStorage para selectedInstitution"
          );
          setError("Error al cargar la institución."); // Establece el error
        }
      } catch (error) {
        console.error(
          "Error al parsear selectedInstitution desde localStorage:",
          error
        );
        setError("Error al cargar la institución."); // Establece el error
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
    <div className="h-full bg-white text-black">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">GESTIÓN ESTATAL</h1>
          <h4 className="text-sm">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h4>
        </div>
        <div className="w-10 h-10 ml-4 flex justify-center items-center text-black bg-slate-200 text-xl">
          <p>1</p>
        </div>
      </div>
      <CuiComponent selectedInstitution={selectedInstitution} initialCui={selectedInstitution?.cui} onCuiInputChange={()=>{}} isReadOnly={true} label="COMPLETE UN ÚNICO FORMULARIO N°1 CORRESPONDIENTE AL PREDIO QUE ESTÁ RELEVANDO"/>
      <div className="flex mt-2 mx-10 p-2 border items-center justify-center gap-4">
        <div className="border bg-slate-200 p-2 font-bold text-sm">
          <p>CENSISTA</p>
        </div>
        <div className="flex gap-2 border bg-slate-200 p-2 font-bold text-sm">
          <p>Nombre y apellido:</p>
          <p>Ignacio Sosa</p>
        </div>
        <div className="flex gap-2 border bg-slate-200 p-2 font-bold text-sm">
          <p>DNI:</p>
          <p>34.835.912</p>
        </div>
      </div>
      <VisitasComponent/>
      <RespondientesDelCuiComponent/>
      <EstablecimientosPrivados/>
    </div>
  );
}
