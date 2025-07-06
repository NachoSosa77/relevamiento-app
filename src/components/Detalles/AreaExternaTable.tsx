/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AreasExteriores } from "@/interfaces/AreaExterior";
import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { areasExterioresService } from "@/services/areasExterioresService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditAreaExteriorModal from "../Modals/EditAreaExteriorModal";
import Spinner from "../ui/Spinner";

interface Props {
  relevamientoId: number;
}



export const AreaExternaTable = ({ relevamientoId }: Props) => {
  const [areas, setAreas] = useState<AreasExteriores[]>([]);
  const [opcionesAreas, setOpcionesAreas] = useState<TipoAreasExteriores[]>([]);
  const [opcionesTerminacionPiso, setOpcionesTerminacionPiso] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Estado para edición en modal
  const [modalVisible, setModalVisible] = useState(false);
  const [areaEditando, setAreaEditando] = useState<AreasExteriores | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await areasExterioresService.getAreasExterioresByRelevamientoId(
          relevamientoId
        );
        setAreas(data.areasExteriores);
        const [areas, pisos] =
          await Promise.all([
          areasExterioresService.getOpcionesAreasExteriores(),
          areasExterioresService.getOpcionesTerminacionPiso(), // suponiendo que este método existe
        ]);
        setOpcionesAreas(areas);
        setOpcionesTerminacionPiso(pisos);
      } catch (error) {
        toast.error("Error al cargar áreas exteriores");
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, [relevamientoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  const abrirModalEditar = (area: AreasExteriores) => {
    setAreaEditando(area);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setAreaEditando(null);
  };

  const onSaveArea = async (areaActualizada: AreasExteriores) => {
  try {
    if (areaActualizada.id === undefined) {
      throw new Error("El id del área es indefinido, no se puede actualizar");
    }

    await areasExterioresService.updateAreaExterior(areaActualizada.id, areaActualizada);

    setAreas((prev) =>
      prev.map((a) => (a.id === areaActualizada.id ? areaActualizada : a))
    );

    toast.success("Área actualizada correctamente");
    cerrarModal();
  } catch (error) {
    toast.error("Error al actualizar el área exterior");
    console.error(error);
  }
};


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
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id} className="text-center">
                  <td className="border border-gray-300 p-2">{area.identificacion_plano}</td>
                  <td className="border border-gray-300 p-2">{area.tipo}</td>
                  <td className="border border-gray-300 p-2">{area.superficie}</td>
                  <td className="border border-gray-300 p-2">{area.terminacion_piso || "-"}</td>
                  <td className="border border-gray-300 p-2">{area.estado_conservacion || "-"}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600/50"
                      onClick={() => abrirModalEditar(area)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && areaEditando && (
        <EditAreaExteriorModal
          open={modalVisible}
          onClose={cerrarModal}
          area={areaEditando}
          onSave={onSaveArea}
          opcionesAreas={opcionesAreas}
          modoCompleto={true}
          // si necesitás opciones o props adicionales, agregalas acá
        />
      )}
    </div>
  );
};
