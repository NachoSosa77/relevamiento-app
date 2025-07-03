/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ServiciosBasicos } from "@/interfaces/ServiciosBasicos";
import { serviciosBasicosService } from "@/services/serviciosBasicosService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

interface Props {
  relevamientoId: number;
}

export const ServiciosBasicosTable = ({ relevamientoId }: Props) => {
  const [servicios, setServicios] = useState<ServiciosBasicos[]>([]);
    const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await serviciosBasicosService.getServiciosBasicosByRelevamientoId(
          relevamientoId
        );
        setServicios(data);
      } catch (error) {
        toast.error("Error al cargar servicios básicos");
      }finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, [relevamientoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-4 py-2 text-left font-semibold flex justify-between items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="servicios-basicos-content"
      >
        Servicios Básicos
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
        <div id="servicios-basicos-content" className="p-4 overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Tipo Servicio</th>
                <th className="border border-gray-300 p-2">Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="text-center">
                  <td className="border border-gray-300 p-2">{servicio.servicio}</td>
                   <td className="border border-gray-300 p-2">{servicio.en_predio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
