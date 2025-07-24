"use client";

import ConstruccionInstituciones from "@/components/ConstruccionInstituciones";
import CuiConstruccionComponent from "@/components/Forms/dinamicForm/CuiConstruccionComponent";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import Spinner from "@/components/ui/Spinner";
import { useCuiFromRelevamientoId } from "@/hooks/useCuiByRelevamientoId";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { selectServiciosAgua } from "@/redux/slices/servicioAguaSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AguaFormComponent from "./components/AguaFormComponent";
import AntiguedadComponent from "./components/Antiguedad";
import CantidadPlantas from "./components/CantidadPlantas";
import CaracteristicasConservacion from "./components/CaracteristicasConservacion";
import Comedor from "./components/Comdedor";
import CondicionesAccesibilidad from "./components/CondicionesAccesibilidad";
import ElectricidadServicio from "./components/ElectricidadServicio";
import EnergiasAlternativas from "./components/EnergiasAlternativas";
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
  const router = useRouter();
  const [selectedInstitutions, setSelectedInstitutions] = useState<
    InstitucionesData[] | null
  >(null);
  const [construccionId, setConstruccionId] = useState<number | null>(null);
  const [relevadas, setRelevadas] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const todasRelevadas = !!construccionId;

  const relevamientoId = useRelevamientoId();
  const selectedCui = useCuiFromRelevamientoId(relevamientoId);
  const serviciosDeAguaEnRedux = useAppSelector(selectServiciosAgua);

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    handleSaveConstruccion(); // tu función real
  };

  const handleCancelSave = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {}, [serviciosDeAguaEnRedux]);

  useEffect(() => {
    if (!relevamientoId) return;

    const fetchInstitucionesRelacionadas = async () => {
      try {
        const response = await fetch(
          `/api/instituciones_por_relevamiento/${relevamientoId}`
        );
        if (!response.ok)
          throw new Error("Error al obtener instituciones relacionadas");

        const data = await response.json();
        setSelectedInstitutions(data);
      } catch (error) {
        console.error("Error al cargar instituciones del relevamiento:", error);
      }
    };

    fetchInstitucionesRelacionadas();
  }, [relevamientoId]);

  const handleSaveObservaciones = async (obs: string) => {
    if (!construccionId || !obs.trim()) return;

    try {
      const res = await fetch(`/api/construcciones/${construccionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observaciones: obs }),
      });

      if (res.ok) {
        // 🚀 Marcamos como relevada:
        marcarComoRelevada(construccionId);
      } else {
        console.error("Error al guardar observaciones");
        toast.error("Observaciones guardadas correctamente");
      }
    } catch (err) {
      console.error("Error de red al guardar:", err);
    }
  };
  const handleSaveConstruccion = () => {
    toast.success("Construcciones guardadas correctamente", {
      position: "top-right",
      autoClose: 3000,
    });
    router.push("/relevamiento-locales");
  };

  console.log(construccionId)

  const marcarComoRelevada = (id: number) => {
    if (!relevadas.includes(id)) {
      setRelevadas([...relevadas, id]);
    }
  };

  if (!selectedCui || selectedInstitutions === null) {
  return (
    <div className="flex justify-center items-center h-full mt-40">
      <Spinner />
    </div>
  );
}

  return (
    <div className="h-full bg-white text-black text-sm mt-28">
      <div className="flex justify-between mt-20 mb-8 mx-8">
        <div className="flex items-center">
          <h1 className="font-bold">Relevamiento N° {relevamientoId}</h1>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold">GESTIÓN ESTATAL</h1>
          <h4 className="text-sm">
            FORMULARIO DE RELEVAMIENTO DE LAS CONSTRUCCIONES
          </h4>
        </div>
        <div className="w-10 h-10 rounded-full ml-4 flex justify-center items-center text-white bg-custom text-xl">
          <p>2</p>
        </div>
      </div>
      <CuiConstruccionComponent
        selectedInstitutions={selectedInstitutions}
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        isReadOnly={false}
        label="COMPLETE UN FORMULARIO POR CADA CONSTRUCCIÓN DEL PREDIO"
        sublabel="Transcriba de la hoja de ruta el Número de CUI y del plano el número de construcción."
        setConstruccionId={setConstruccionId}
      />

      {!construccionId ? (
        <div className="mt-10 flex flex-col items-center gap-4">
          <Spinner />
        </div>
      ) : (
        <>
          {" "}
          {/* Este debajo para gestionar las instituciones asociadas */}
          <ConstruccionInstituciones
            construccionId={construccionId}
            relevamientoId={relevamientoId}
          />
          <CantidadPlantas construccionId={construccionId} />
          <AntiguedadComponent construccionId={construccionId} />
          <ServiciosBasicos data={serviciosBasicos} />
          <AguaFormComponent
            relevamientoId={relevamientoId}
            construccionId={construccionId}
          />
          <ServiciosReu
            id={4}
            label={"DESAGUES CLOACALES"}
            sub_id={4}
            sublabel={"DESAGUES CLOACALES"}
            servicios={servicioDesague}
            endpoint="/api/servicio_desague"
            construccionId={construccionId}
          />
          <ServiciosReu
            id={5}
            label={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
            sub_id={5}
            sublabel={"INSTALACIÓN DE GAS U OTRO COMBUSTIBLE"}
            servicios={servicioGas}
            endpoint="/api/servicio_gas"
            construccionId={construccionId}
          />
          <ElectricidadServicio
            id={6}
            label="ELECTRICIDAD"
            sub_id={6.1}
            sublabel="TIPO DE PROVISIÓN"
            servicios={servicioElectricidad}
            construccionId={construccionId}
          />
          <ElectricidadServicio
            id={0}
            label="CARACTERÍSTICAS DE LOS TABLEROS DE ELECTRICIDAD"
            sub_id={6.2}
            sublabel="CARACTERÍSTICAS DE LOS TABLEROS DE ELECTRICIDAD"
            servicios={tablerosElectricidad}
            construccionId={construccionId}
          />
          <SeguridadIncendio
            id={7}
            label="INSTALACIONES DE SEGURIDAD Y CONTRA INCENDIO"
            sub_id={7}
            sublabel=""
            servicios={seguridadIncendio}
            construccionId={construccionId}
          />
          <CondicionesAccesibilidad
            id={8}
            label="CONDICIONES ACCESIBILIDAD"
            sub_id={8}
            sublabel=""
            servicios={servicioAccesibilidad}
            construccionId={construccionId}
          />
          <Comedor
            id={9}
            label="USO DEL COMEDOR"
            sub_id={9}
            sublabel=""
            servicios={usoComedor}
            construccionId={construccionId}
          />
          <SeparadorReutilizable data={caracteristicasConstruccion} />
          <CaracteristicasConservacion
            id={10}
            label="ESTRUCTURA RESISTENTE"
            estructuras={estructuraResistente}
            construccionId={construccionId}
            tipo="estructura_resistente"
          />
          <CaracteristicasConservacion
            id={11}
            label="TECHO"
            estructuras={estructuraTecho}
            construccionId={construccionId}
            tipo="techo"
          />
          <CaracteristicasConservacion
            id={12}
            label="PAREDES Y CERRAMIENTOS EXTERIORES"
            estructuras={paredesCerramientos}
            construccionId={construccionId}
            tipo="paredes_cerramientos"
          />
          <EnergiasAlternativas
            id={13}
            label="ENERGÍAS ALTERNATIVAS"
            estructuras={energiasAlternativas}
            construccionId={construccionId}
          />
          <ObservacionesComponent onSave={handleSaveObservaciones} />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowConfirmModal(true)}
              className={`px-4 py-2 w-80 text-white font-semibold rounded-md ${
                todasRelevadas
                  ? "bg-custom hover:bg-custom/50"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!todasRelevadas}
            >
              Guardar construcción
            </button>
          </div>
        </>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4">
              ¿Desea guardar esta construcción?
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Si hay datos sin completar, no podrá modificarlos desde aquí.
              Puede cancelar para volver y completar lo faltante.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelSave}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 rounded-md bg-custom hover:bg-custom/50 text-white"
              >
                Confirmar y guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
