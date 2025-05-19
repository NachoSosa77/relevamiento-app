/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion, LocalesConstruccion } from "@/interfaces/Locales";
import { construccionService } from "@/services/Construcciones/construccionesService";
import { localesService } from "@/services/localesServices";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LocalDetalleModal } from "./LocalesConstruccion";

interface Props {
  relevamientoId: number;
  numeroConstruccion: number;
}

export const ConstruccionDetalleAccordion = ({
  relevamientoId,
  numeroConstruccion,
}: Props) => {
  const [construccion, setConstruccion] = useState<Construccion>();
  const [locales, setLocales] = useState<LocalesConstruccion[]>([]);
  const [localSeleccionado, setLocalSeleccionado] =
    useState<LocalesConstruccion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLocales, setShowLocales] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = (local: LocalesConstruccion) => {
    setLocalSeleccionado(local);
    setShowModal(true);
  };

  const toggleLocales = async () => {
    if (!showLocales && locales.length === 0) {
      try {
        const data = await localesService.getLocalesByConstruccionId(
          construccion?.id
        );
        console.log(data)
        setLocales(data);
      } catch (error) {
        toast.error("No se pudieron cargar los locales");
      }
    }
    setShowLocales(!showLocales);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await construccionService.getConstruccionByNumero(
          relevamientoId,
          numeroConstruccion
        );
        setConstruccion(data);
      } catch (error) {
        // No mostrar toast para evitar spam, solo marcar como no cargado
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [relevamientoId, numeroConstruccion]);

  const toggle = () => setExpanded(!expanded);

  return (
    <div className="border rounded-md p-3 bg-white shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            Construcción #{numeroConstruccion}
          </span>
          {loading ? (
            <span className="text-gray-400 text-sm">(cargando...)</span>
          ) : construccion ? (
            <CheckCircle className="text-green-500 w-4 h-4" />
          ) : (
            <AlertTriangle className="text-yellow-500 w-4 h-4" />
          )}
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="mt-3 text-sm text-gray-700">
          {construccion && (
            <>
              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <strong>Superficie cubierta:</strong>{" "}
                  {construccion.superficie_cubierta} m²
                </p>
                <p>
                  <strong>Superficie semicubierta:</strong>{" "}
                  {construccion.superficie_semicubierta} m²
                </p>
                <p>
                  <strong>Superficie total:</strong>{" "}
                  {construccion.superficie_total} m²
                </p>
              </div>

              <button
                onClick={toggleLocales}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                {showLocales ? "Ocultar locales" : "Ver locales"}
              </button>

              {showLocales && (
                <div className="mt-2 space-y-2">
                  {showLocales && (
                    <div className="mt-2 space-y-2">
                      {showLocales && (
                        <div className="mt-4">
                          {locales.length === 0 ? (
                            <p className="text-gray-500">
                              No hay locales cargados para esta construcción.
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left mt-3 border rounded">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2">Tipo</th>
                                    <th className="px-3 py-2">
                                      Identificación
                                    </th>
                                    <th className="px-3 py-2">
                                      Superficie (m²)
                                    </th>
                                    <th className="px-3 py-2">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {locales.map((local) => (
                                    <tr key={local.id} className="border-t">
                                      <td className="px-3 py-2">
                                        {local.tipo}
                                      </td>
                                      <td className="px-3 py-2">
                                        {local.identificacion_plano}
                                      </td>
                                      <td className="px-3 py-2">
                                        {local.superficie}
                                      </td>
                                      <td className="px-3 py-2">
                                        <button
                                          onClick={() => openModal(local)}
                                          className="text-blue-600 hover:underline"
                                        >
                                          Ver detalle
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {showModal && localSeleccionado && (
                <LocalDetalleModal
                  local={localSeleccionado}
                  onClose={() => setShowModal(false)}
                  isOpen={showModal}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
