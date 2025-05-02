"use client";

import CuiConstruccionComponent from "@/components/Forms/dinamicForm/CuiConstruccionComponent";
import Navbar from "@/components/NavBar/NavBar";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { selectServiciosAgua } from "@/redux/slices/servicioAguaSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AguaFormComponent from "./components/AguaFormComponent";
import AntiguedadComponent from "./components/Antiguedad";
import CantidadPlantas from "./components/CantidadPlantas";
import CaracteristicasConservacion from "./components/CaracteristicasConservacion";
import Comedor from "./components/Comdedor";
import CondicionesAccesibilidad from "./components/CondicionesAccesibilidad";
import ElectricidadServicio from "./components/ElectricidadServicio";
import SeguridadIncendio from "./components/SeguridadIncendio";
import {
  default as SeparadorReutilizable,
  default as ServiciosBasicos,
} from "./components/ServiciosBasicos";
import ServiciosReu from "./components/ServiciosReu";
import { servicioAccesibilidad } from "./config/relevamientoAccesibilidad";
import { usoComedor } from "./config/relevamientoComedor";
import { servicioDesague } from "./config/relevamientoDesague";
import {
  servicioElectricidad,
  tablerosElectricidad,
} from "./config/relevamientoElectricidad";
import {
  energiasAlternativas,
  estructuraResistente,
  estructuraTecho,
  paredesCerramientos,
} from "./config/relevamientoEstructura";
import { servicioGas } from "./config/relevamientoGas";
import { seguridadIncendio } from "./config/relevamientoSeguridadIncendio";
import {
  caracteristicasConstruccion,
  serviciosBasicos,
} from "./config/separadoresServicios";
// ... otros imports

export default function RelevamientoConstruccionesPage() {
  const [selectedInstitutions, setSelectedInstitutions] =
    useState<InstitucionesData[] | null>(null);

  const selectedCui = useAppSelector(
          (state) => state.espacio_escolar.cui
        );

  const institucionesRedux = useSelector(
    (state: RootState) => state.espacio_escolar.institucionesSeleccionadas
  );
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  /* const construccionTemporal = useSelector(
    (state: RootState) => state.construcciones.construccionTemporal
  ); */
  // Usar useEffect para escuchar cuando el estado cambia
  //console.log("Construcción temporal:", construccionTemporal);
  //console.log('relevamientoId', relevamientoId);

  const serviciosDeAguaEnRedux = useAppSelector(selectServiciosAgua);
  useEffect(() => {
    /* console.log("Estado de servicios de agua en Redux:", serviciosDeAguaEnRedux) */;
  }, [serviciosDeAguaEnRedux]);

  useEffect(() => {
    if (institucionesRedux.length > 0) {
      setSelectedInstitutions(institucionesRedux);
    }
  }, [institucionesRedux]);

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
        selectedInstitutions={selectedInstitutions}
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN FORMULARIO POR CADA CONSTRUCCIÓN DEL PREDIO"
        sublabel="Transcriba de la hoja de ruta el Número de CUI y del plano el número de construcción."
      />
      <CantidadPlantas/>
      <AntiguedadComponent />
      <ServiciosBasicos data={serviciosBasicos} />
      <AguaFormComponent relevamientoId={relevamientoId}/>
      <ServiciosReu
        id={4}
        label={"DESAGUES CLOACALES"}
        sub_id={4}
        sublabel={"DESAGUES CLOACALES"}
        servicios={servicioDesague}
        endpoint="/api/servicio_desague"
      />
      <ServiciosReu
        id={5}
        label={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
        sub_id={5}
        sublabel={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
        servicios={servicioGas}
        endpoint="/api/servicio_gas"
      />
      <ElectricidadServicio
        id={6}
        label="ELECTRICIDAD"
        sub_id={6.1}
        sublabel="TIPO DE PROVISIÓN"
        servicios={servicioElectricidad}
      />
      <ElectricidadServicio
        id={0}
        label="CARACTERÍSTICAS DE LOS TABLEROS DE ELECTRICIDAD"
        sub_id={6.2}
        sublabel="CARACTERÍSTICAS DE LOS TABLEROS DE ELECTRICIDAD"
        servicios={tablerosElectricidad}
      />
      <SeguridadIncendio
        id={7}
        label="INSTALACIONES DE SEGURIDAD Y CONTRA INCENDIO"
        sub_id={7}
        sublabel=""
        servicios={seguridadIncendio}
      />
      <CondicionesAccesibilidad
        id={8}
        label="CONDICIONES ACCESIBILIDAD"
        sub_id={8}
        sublabel=""
        servicios={servicioAccesibilidad}
      />
      <Comedor
        id={9}
        label="USO DEL COMEDOR"
        sub_id={9}
        sublabel=""
        servicios={usoComedor}
      />
      <SeparadorReutilizable data={caracteristicasConstruccion} />
      <CaracteristicasConservacion
        id={10}
        label="ESTRUCTURA RESISTENTE"
        estructuras={estructuraResistente}
      />
      <CaracteristicasConservacion
        id={11}
        label="TECHO"
        estructuras={estructuraTecho}
      />
      <CaracteristicasConservacion
        id={12}
        label="PAREDES Y CERRAMIENTOS EXTERIORES"
        estructuras={paredesCerramientos}
      />
      <CaracteristicasConservacion
        id={13}
        label="ENERGÍAS ALTERNATIVAS"
        estructuras={energiasAlternativas}
      />

      <ObservacionesComponent onSave={()=>{}}/>
    </div>
  );
}
