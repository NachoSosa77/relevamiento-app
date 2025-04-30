"use client";

import { useAppSelector } from "@/redux/hooks";
import { agregarServicioAgua } from "@/redux/slices/servicioAguaSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface Servicio {
  id: string;
  question: string;
  showCondition: boolean;
}

interface ServiciosReuProps {
  id: number;
  label: string;
  sub_id: number;
  sublabel: string;
  servicios: Servicio[];
  tipoServicio?: "provision" | "almacenamiento" | "alcance" | "calidad" | null; // Prop opcional
}

export default function ServiciosReu({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  tipoServicio,
}: ServiciosReuProps) {
  const [selectedServicios, setSelectedServicios] = useState<
    { servicio: string; estado?: string }[]
  >([]);
  const dispatch = useDispatch();
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  ); // Asumo que 'espacio_escolar' contiene el relevamientoId

  console.log("Relevamiento ID:", relevamientoId);

  const handleServicioSelect = (servicioId: string) => {
    const servicio = servicios.find((s) => s.id === servicioId);
    if (!servicio) return;
    const alreadySelected = selectedServicios.some(
      (s) => s.servicio === servicio.question
    );
    if (!alreadySelected) {
      setSelectedServicios((prev) => [
        ...prev,
        { servicio: servicio.question },
      ]);
    }
  };

  const handleEstadoChange = (servicioQuestion: string, estado: string) => {
    setSelectedServicios((prev) =>
      prev.map((s) => (s.servicio === servicioQuestion ? { ...s, estado } : s))
    );
  };

  const handleGuardar = () => {
    if (tipoServicio === "provision" && relevamientoId) {
      selectedServicios.forEach(({ servicio, estado }) => {
        dispatch(
          agregarServicioAgua({
            servicio: servicio,
            estado: estado,
            relevamiento_id: relevamientoId,
          })
        );
      });
      setSelectedServicios([]);
      console.log("Servicios de provisión despachados a Redux");
    } else {
      console.log("Guardar local:", selectedServicios);
      // Aquí podrías agregar lógica para otros 'tipoServicio' si es necesario
    }
  };

  return (
    <div className="mx-10 text-sm">
      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
          <div className="w-6 h-6 flex justify-center text-white bg-black">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center bg-slate-200">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}
      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
          <div className="w-6 h-6 flex justify-center text-black font-bold">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center bg-slate-200">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
      )}

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2">Servicio</th>
            <th className="border p-2">Estado (si corresponde)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2" colSpan={2}>
              <select
                onChange={(e) => handleServicioSelect(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.question}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {selectedServicios.map(({ servicio, estado }) => {
            const currentServicio = servicios.find(
              (s) => s.question === servicio
            );
            return (
              <tr key={servicio}>
                <td className="border p-2">{servicio}</td>
                <td className="border p-2">
                  {currentServicio?.showCondition ? (
                    <select
                      value={estado || ""}
                      onChange={(e) =>
                        handleEstadoChange(servicio, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Malo">Malo</option>
                    </select>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar servicios
        </button>
      </div>
    </div>
  );
}
