"use client";

import CuiLocalesComponent from "@/components/Forms/dinamicForm/CuiLocalesComponent";
import Navbar from "@/components/NavBar/NavBar";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";
import FormReutilizable from "./components/FormReutilizable";
import { tipoLocal } from "./config/tipoLocal";

export default function RelevamientoConstruccionesPage() {
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores

  // Obtiene el usuario actual
  /* useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-token", { credentials: "include" });
        const data = await res.json();
        console.log("Token obtenido desde backend:", data.token);
  
        if (data.token) {
          const decodedUser: UserData = jwtDecode(data.token);
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
      setLoading(false)
    };
  
    fetchUser();
  }, []); //El array vacío asegura que esto se ejecuta solo una vez al montar el componente */

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
          console.log("parsedInstitution", parsedInstitution);
          setSelectedInstitution(parsedInstitution);
          setLoading(false); // Actualiza loading a false aquí
        } else {
          console.warn(
            "Datos incorrectos en localStorage para selectedInstitution"
          );
          setError("Error al cargar la institución."); // Establece el error
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Error al parsear selectedInstitution desde localStorage:",
          error
        );
        setError("Error al cargar la institución."); // Establece el error
        setLoading(false);
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
          <h4 className="text-sm">
            FORMULARIO DE RELEVAMIENTO DE LAS CONSTRUCCIONES
          </h4>
        </div>
        <div className="w-10 h-10 ml-4 flex justify-center items-center text-black bg-slate-200 text-xl">
          <p>2</p>
        </div>
      </div>
      <CuiLocalesComponent
        selectedInstitution={selectedInstitution}
        initialCui={selectedInstitution?.cui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN FORMULARIO EXCLUSIVAMENTE POR CADA LOCAL CON FUNCIONES PEDAGÓGICAS (AULA COMÚN, SALA DE NIVEL INICIAL AULA ESPECIAL, LABORATORIO, TALLER, GIMNASIO, PISCINA
        CUBIERTA, BIBLIOTECA/CENTRO DE RECURSOS, SALA DE ESTUDIO, SALÓN DE USOS MÚLTIPLES/PATIO CUBIERTO, OTRO LOCAL PEDAGÓGICO) Y DE SERVICIOS (EXCLUSIVAMENTE COMEDOR, COCINA,
        OFFICE, SANITARIOS DE ALUMNOS, SANITARIOS DE DOCENTES/PERSONAL)."
        onInstitutionSelected={() => {}}
        sublabel="Transcriba de la hoja de ruta el Número de CUI y del plano los números de construcción y local."
      />
      <FormReutilizable
      id={1}
      label="TIPO DE LOCAL"
      locales={tipoLocal}
      />
    </div>
  );
}
