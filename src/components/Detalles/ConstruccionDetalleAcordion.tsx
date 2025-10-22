/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion, LocalesConstruccion } from "@/interfaces/Locales";
import { useAppDispatch } from "@/redux/hooks";
import { setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { localesService } from "@/services/localesServices";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { LocalDetalleModal } from "./LocalesConstruccion";

interface Props {
  construccion: Construccion;
  relevamientoId: number;
}

export const ConstruccionDetalleAccordion = ({
  construccion,
  relevamientoId,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [locales, setLocales] = useState<LocalesConstruccion[]>([]);
  const [localSeleccionado, setLocalSeleccionado] =
    useState<LocalesConstruccion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLocales, setShowLocales] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const openModal = (local: LocalesConstruccion) => {
    setLocalSeleccionado(local);
    setShowModal(true);
  };

  const handleEditarLocales = () => {
    dispatch(setRelevamientoId(relevamientoId));
    router.push("/relevamiento-locales"); // o la ruta que uses
  };

  const toggleLocales = async () => {
    if (!showLocales && locales.length === 0 && construccion.id) {
      try {
        const data = await localesService.getLocalesByConstruccionId(
          construccion.id
        );
        setLocales(data);
      } catch (error) {
        toast.error("No se pudieron cargar los locales");
      }
    }
    setShowLocales(!showLocales);
  };

  const toggle = () => setExpanded(!expanded);

  return (
    <div className="border rounded-md p-3 bg-white shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            N° de construcción{" "}
            {construccion.numero_construccion ?? construccion.id}
          </span>
          {construccion ? (
            <CheckCircle className="text-green-500 w-4 h-4 font-bold" />
          ) : (
            <AlertTriangle className="text-yellow-500 w-4 h-4 font-bold" />
          )}
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
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
            <strong>Superficie total:</strong> {construccion.superficie_total}{" "}
            m²
          </p>

          <button
            onClick={toggleLocales}
            className="px-4 py-2 w-52 bg-custom text-white rounded-md hover:bg-custom/50 mt-3"
          >
            {showLocales ? "Ocultar locales" : "Ver locales"}
          </button>

          {showLocales && (
            <div className="mt-4">
              <button
                onClick={handleEditarLocales}
                className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
              >
                Editar Locales
              </button>
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
                        <th className="px-3 py-2">Identificación</th>
                        <th className="px-3 py-2">Superficie (m²)</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locales.map((local) => (
                        <tr key={local.id} className="border-t">
                          <td className="px-3 py-2">{local.tipo}</td>
                          <td className="px-3 py-2">
                            {local.identificacion_plano}
                          </td>
                          <td className="px-3 py-2">{local.superficie}</td>
                          <td
                            className={`font-semibold px-3 py-2 ${
                              local.estado === "completo"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {local.estado}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => openModal(local)}
                              className="text-custom hover:underline"
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

          {showModal && localSeleccionado && (
            <LocalDetalleModal
              local={localSeleccionado}
              onClose={() => setShowModal(false)}
              isOpen={showModal}
            />
          )}
        </div>
      )}
    </div>
  );
};
