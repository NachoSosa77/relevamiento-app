/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Construccion, LocalesConstruccion } from "@/interfaces/Locales";
import { construccionService } from "@/services/Construcciones/construccionesService";
import { localesService } from "@/services/localesServices";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  relevamientoId: number;
  numeroConstruccion: number;
}

export const ConstruccionDetalleAccordion = ({ relevamientoId, numeroConstruccion }: Props) => {
  const [construccion, setConstruccion] = useState<Construccion>();
  const [locales, setLocales] = useState<LocalesConstruccion[]>([]);
  const [showLocales, setShowLocales] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleLocales = async () => {
  if (!showLocales && locales.length === 0) {
    try {
      const data = await localesService.getLocalesByConstruccionId(construccion?.id);
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
        const data = await construccionService.getConstruccionByNumero(relevamientoId, numeroConstruccion);
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
          <span className="font-semibold">Construcción #{numeroConstruccion}</span>
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
      <p><strong>Superficie cubierta:</strong> {construccion.superficie_cubierta} m²</p>
      <p><strong>Superficie semicubierta:</strong> {construccion.superficie_semicubierta} m²</p>
      <p><strong>Superficie total:</strong> {construccion.superficie_total} m²</p>
    </div>

    <button
      onClick={toggleLocales}
      className="mt-3 text-blue-600 hover:underline text-sm"
    >
      {showLocales ? "Ocultar locales" : "Ver locales"}
    </button>

    {showLocales && (
      <div className="mt-2 space-y-2">
        {locales.length === 0 ? (
          <p className="text-gray-500">No hay locales cargados para esta construcción.</p>
        ) : (
          locales.map((local) => (
            <div key={local.id} className="border p-2 rounded bg-gray-50">
              <p><strong>Tipo:</strong> {local.tipo}</p>
              <p><strong>Identificación en el plano:</strong> {local.identificacion_plano}</p>
              <p><strong>Superficie:</strong> {local.superficie} m²</p>
            </div>
          ))
        )}
      </div>
    )}
  </>
)}

        </div>
      )}
    </div>
  );
};
