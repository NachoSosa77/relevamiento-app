// components/Construcciones/LocalDetalleModal.tsx

"use client";

import { useEquipamientoSanitario } from "@/app/home/relevamiento/config/useData";
import { LocalesConstruccion } from "@/interfaces/Locales";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Accordion } from "../ui/Acordion";
import { AccordionItem } from "../ui/AcordionItem";
import AberturasComponent from "./AberturasComponent";
import AcondicionamientoTermicoComponent from "./AcondicionamientoTermicoComponent";
import CocinaComponent from "./CocinaComponent";
import IluVentilacionComponent from "./IluminacionVentilacionComponent";
import InstalacionesBasicasComponent from "./InstalacionesBasicasComponent";
import MaterialesComponent from "./MaterialesComponente";
import SanitariosComponent from "./SanitariosComponente";
interface Props {
  local: LocalesConstruccion;
  onClose: () => void;
  isOpen: boolean;
}

export const LocalDetalleModal = ({ local, onClose, isOpen }: Props) => {
  const { data: equipamientos } = useEquipamientoSanitario(
    local.id,
    local.relevamiento_id
  );

  console.log("Equipamientos", equipamientos);
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 mb-4 flex justify-between items-center"
                >
                  Detalle del Local
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </Dialog.Title>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-800 border-t border-gray-200 pt-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Tipo</span>
                    <span>{local.tipo}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">
                      Identificación en el plano
                    </span>
                    <span>{local.identificacion_plano}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Tipo superficie</span>
                    <span>{local.tipo_superficie}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Superficie</span>
                    <span>{local.superficie} m²</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Largo predominante</span>
                    <span>{local.largo_predominante}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Ancho predominante</span>
                    <span>{local.ancho_predominante}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Altura máxima</span>
                    <span>{local.altura_maxima}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Altura mínima</span>
                    <span>{local.altura_minima}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">
                      Protección contra robo
                    </span>
                    <span>{local.proteccion_contra_robo || "N/a"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Observaciones</span>
                    <span>{local.observaciones || "N/a"}</span>
                  </div>
                </div>

                {/* SERVICIOS ASOCIADOS */}
                <div className="mt-6 border-t border-gray-200 pt-4 ">
                  <Accordion type="single" className="w-full text-sm space-y-2">
                    <AccordionItem
                      title="Materiales predominantes"
                      value="materiales"
                    >
                      <MaterialesComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>
                    <AccordionItem title="Aberturas" value="aberturas">
                      <AberturasComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title="Iluminación y ventilación"
                      value="ventilacion"
                    >
                      <IluVentilacionComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title="Acondicionamiento térmico"
                      value="terminco"
                    >
                      <AcondicionamientoTermicoComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title="Instalaciones básicas"
                      value="instalaciones"
                    >
                      <InstalacionesBasicasComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>
                     {(local.tipo === "Cocina" ||
                      local.tipo === "Oficina") && (
                      <AccordionItem
                        title="Equipamiento de cocinas/offices"
                        value="cocina"
                      >
                        <CocinaComponent
                          localId={local.id}
                          relevamientoId={local.relevamiento_id}
                        />
                      </AccordionItem>
                    )}
                    {(local.tipo === "Sanitarios Alumnos" ||
                      local.tipo === "Sanitarios Docentes/Personal") && (
                      <AccordionItem
                        title="Equipamiento Sanitario"
                        value="sanitarios"
                      >
                        <SanitariosComponent
                          localId={local.id}
                          relevamientoId={local.relevamiento_id}
                        />
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
