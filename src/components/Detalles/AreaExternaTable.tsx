/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { areasExterioresService } from "@/services/areasExterioresService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  relevamientoId: number;
}

interface AreaExterior {
  id: number;
  identificacion_plano: string;
  tipo: string;
  superficie: string;
  estado_conservacion?: string;
  terminacion_piso?: string;
}

export const AreaExternaTable = ({ relevamientoId }: Props) => {
  const [areas, setAreas] = useState<AreaExterior[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await areasExterioresService.getAreasExterioresByRelevamientoId(
          relevamientoId
        );
        setAreas(data.areasExteriores);
      } catch (error) {
        toast.error("Error al cargar áreas exteriores");
      }
    };
    fetchAreas();
  }, [relevamientoId]);

  if (areas.length === 0) return <p>No hay áreas exteriores registradas.</p>;

  return (
    <div className="border rounded-md p-2 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-4 py-2 text-left font-semibold flex justify-between items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="areas-exteriores-content"
      >
        Áreas Exteriores
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div id="areas-exteriores-content" className="p-4 overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Identificación Plano</th>
                <th className="border border-gray-300 p-2">Tipo</th>
                <th className="border border-gray-300 p-2">Superficie (m²)</th>
                <th className="border border-gray-300 p-2">Terminación Piso</th>
                <th className="border border-gray-300 p-2">Estado Conservación</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  <td className="border border-gray-300 p-2">{area.identificacion_plano}</td>
                  <td className="border border-gray-300 p-2">{area.tipo}</td>
                  <td className="border border-gray-300 p-2">{area.superficie}</td>
                  <td className="border border-gray-300 p-2">{area.terminacion_piso || "-"}</td>
                  <td className="border border-gray-300 p-2">{area.estado_conservacion || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
