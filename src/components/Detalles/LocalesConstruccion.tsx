/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Construcciones/LocalDetalleModal.tsx

"use client";

import { useEquipamientoSanitario } from "@/app/home/relevamiento/config/useData";
import { LocalesConstruccion, TipoLocales } from "@/interfaces/Locales";
import { localesService } from "@/services/localesServices";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditLocalModal from "../Modals/EditLocalModal";
import { Accordion } from "../ui/Acordion";
import { AccordionItem } from "../ui/AcordionItem";
import Spinner from "../ui/Spinner";
import AberturasComponent from "./AberturasComponent";
import AcondicionamientoTermicoComponent from "./AcondicionamientoTermicoComponent";
import CocinaComponent from "./CocinaComponent";
import IluVentilacionComponent from "./IluminacionVentilacionComponent";
import InstalacionesBasicasComponent from "./InstalacionesBasicasComponent";
import MaterialesComponent from "./MaterialesComponente";
import ObservacionesDetailComponent from "./ObservacionesDetailComponent";
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [locales, setLocales] = useState<LocalesConstruccion[]>([]);
  const [opcionesLocales, setOpcionesLocales] = useState<TipoLocales[]>([]);
  const [localDetalle, setLocalDetalle] = useState<LocalesConstruccion>(local);

  useEffect(() => {
    setLocalDetalle(local);
  }, [local]);

  useEffect(() => {
    if (!local.relevamiento_id) return;

    const fetchLocales = async () => {
      try {
        const data = await localesService.getLocalesPorRelevamiento(
          local.relevamiento_id!
        );
        setLocales(data.areasExteriores);

        const opciones = await localesService.getOpcionesLocales();
        setOpcionesLocales(opciones);
      } catch (error) {
        toast.error("Error al cargar áreas exteriores");
      } finally {
        setLoading(false);
      }
    };

    fetchLocales();
  }, [local.relevamiento_id]);

  const onSaveArea = async (localActualizado: LocalesConstruccion) => {
    try {
      if (localActualizado.id === undefined) {
        throw new Error(
          "El id del local es indefinido, no se puede actualizar"
        );
      }

      await localesService.updateLocalCompleto(
        localActualizado.id,
        localActualizado
      );

      setLocalDetalle(localActualizado);

      setEditModalOpen(false);
    } catch (error) {
      toast.error("Error al actualizar el local");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

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
                  <div className="flex items-center gap-2">
                    <span>Detalle del Local</span>
                    <span className="text-custom">
                      {localDetalle.nombre_local}
                    </span>
                    <button
                      onClick={() => setEditModalOpen(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm rounded-md"
                    >
                      Editar
                    </button>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm  text-white bg-custom hover:bg-custom/50 rounded-md"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </Dialog.Title>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-800 border-t border-gray-200 pt-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">
                      Número de construcción
                    </span>
                    <span>{localDetalle.numero_construccion}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">
                      Identificación en el plano
                    </span>
                    <span>{localDetalle.identificacion_plano}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Tipo superficie</span>
                    <span>{localDetalle.tipo_superficie}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Superficie</span>
                    <span>{localDetalle.superficie} m²</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Largo predominante</span>
                    <span>{localDetalle.largo_predominante}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Ancho predominante</span>
                    <span>{localDetalle.ancho_predominante}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Altura máxima</span>
                    <span>{localDetalle.altura_maxima}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Altura mínima</span>
                    <span>{localDetalle.altura_minima}m</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">
                      Protección contra robo
                    </span>
                    <span>{localDetalle.proteccion_contra_robo || "N/a"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold">Estado</span>
                    <span
                      className={`font-semibold ${
                        localDetalle.estado === "completo"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {localDetalle.estado}
                    </span>
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
                    <AccordionItem
                      title="Equipamiento de cocinas/offices"
                      value="cocina"
                    >
                      <CocinaComponent
                        localId={local.id}
                        relevamientoId={local.relevamiento_id}
                      />
                    </AccordionItem>

                    {(local.tipo === "Sanitarios Alumnos" ||
                      local.tipo === "Servicio" ||
                      local.tipo === "Sala de nivel inicial" ||
                      local.tipo === "Laboratorio" ||
                      local.tipo === "Aula especial" ||
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
                    <AccordionItem title="Ovservaciones" value="observaciones">
                      <ObservacionesDetailComponent
                        observaciones={
                          local.observaciones ??
                          "Sin observaciones registradas."
                        }
                      />
                    </AccordionItem>
                  </Accordion>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      {editModalOpen && (
        <EditLocalModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          local={local}
          modoCompleto={true}
          onSave={onSaveArea}
          opcionesLocales={opcionesLocales}

          // Podés agregar un callback onSave para refrescar datos si lo necesitás
        />
      )}
    </Transition>
  );
};
