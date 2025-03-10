"use client";

import CuiConstruccionComponent from "@/components/Forms/dinamicForm/CuiConstruccionComponent";
import Navbar from "@/components/NavBar/NavBar";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";
import AntiguedadComponent from "./components/Antiguedad";
import CalidadAgua from "./components/CalidadAgua";
import CantidadPlantas from "./components/CantidadPlantas";
import ServiciosBasicos from "./components/ServiciosBasicos";
import ServiciosReu from "./components/ServiciosReu";
import {
  almacenamientoAgua,
  calidadAgua,
  provisionAgua,
  servicioAgua,
} from "./config/relevamientoAgua";
import { servicioDesague } from "./config/relevamientoDesague";
import { servicioGas } from "./config/relevamientoGas";

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
      <CuiConstruccionComponent
        selectedInstitution={selectedInstitution}
        initialCui={selectedInstitution?.cui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN FORMULARIO POR CADA CONSTRUCCIÓN DEL PREDIO"
        onInstitutionSelected={() => {}}
        sublabel="Transcriba de la hoja de ruta el Número de CUI y del plano el número de construcción."
      />
      <CantidadPlantas />
      <AntiguedadComponent />
      <ServiciosBasicos />
      <ServiciosReu
        id={3}
        label={"AGUA"}
        sub_id={3.1}
        sublabel={"TIPO DE PROVISIÓN DE AGUA"}
        servicios={servicioAgua}
      />
      <ServiciosReu
        id={0}
        label={""}
        sub_id={3.2}
        sublabel={"TIPO DE ALMACENAMIENTO"}
        servicios={almacenamientoAgua}
      />
      <ServiciosReu
        id={0}
        label={""}
        sub_id={3.3}
        sublabel={"ALCANCE DE LA PROVISIÓN DE AGUA"}
        servicios={provisionAgua}
      />
      <CalidadAgua
        id={0}
        label={""}
        sub_id={3.4}
        sublabel={"CALIDAD DEL AGUA PARA CONSUMO HUMANO"}
        servicios={calidadAgua}
      />
      <ServiciosReu
        id={4}
        label={"DESAGUES CLOACALES"}
        sub_id={4}
        sublabel={"DESAGUES CLOACALES"}
        servicios={servicioDesague}
      />
      <ServiciosReu
        id={5}
        label={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
        sub_id={5}
        sublabel={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
        servicios={servicioGas}
      />
    </div>
  );
}
