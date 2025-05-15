 
import { Visita } from "@/interfaces/Visitas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  actualizarVisita,
  agregarVisita,
  eliminarVisita,
} from "@/redux/slices/espacioEscolarSlice";
import axios from "axios"; // Importamos axios para enviar la solicitud
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

export default function VisitasComponent() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null); // Guardamos la visita que estamos editando
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const visitas = useAppSelector((state) => state.espacio_escolar.visitas);

  const agregarVisitaModal = () => {
    setEditingVisita(null); // Limpiar cualquier visita previa al agregar una nueva
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingVisita(null); // Limpiamos la visita en edición al cerrar el modal
  };

  // Lógica para agregar visita en Redux
  const manejarEnvio = (nuevaVisita: Visita) => {
    if (!relevamientoId) {
      console.error("Relevamiento ID no disponible");
      toast.error("❌ Relevamiento ID no disponible.");
      return;
    }

    const visitaConRelevamiento = {
      ...nuevaVisita,
      relevamiento_id: relevamientoId,
    };

    if (editingVisita) {
      // Si estamos editando una visita, la actualizamos
      dispatch(actualizarVisita(visitaConRelevamiento));
    } else {
      // Si no estamos editando, la agregamos como nueva
      dispatch(agregarVisita(visitaConRelevamiento));
    }

    cerrarModal();
  };

  // Función para eliminar visita
  const handleEliminar = (numero_visita: number) => {
    if (isNaN(numero_visita)) {
      toast.error("❌ El número de visita no es válido.");
      return;
    }
    dispatch(eliminarVisita(numero_visita));
  };

  // Función para enviar todas las visitas a la base de datos
  const enviarVisitasABaseDeDatos = async () => {
    if (!visitas || visitas.length === 0 || !relevamientoId) {
      toast.error("❌ No hay visitas o relevamiento ID no disponible.");
      return;
    }
  
    try {
      const visitasConRelevamiento = visitas.map((visita) => ({
        ...visita,
        relevamiento_id: relevamientoId,
      }));
  
      const response = await axios.post("/api/visitas", visitasConRelevamiento);
  
      // ✅ Verificamos que el backend haya confirmado el éxito
      if (response.status === 200 && response.data.success) {
        toast.success("Visitas enviadas correctamente a la base de datos");
      } else {
        console.error("Error desde backend:", response.data);
        toast.error("❌ Hubo un problema al guardar las visitas");
      }
    } catch (error) {
      console.error("❌ Error al enviar visitas:", error);
      toast.error("❌ Error al enviar las visitas a la base de datos");
    }
  };
  
  

  const visitasHeader = [
    { Header: "N° visita", accessor: "numero_visita" },
    { Header: "Fecha", accessor: "fecha" },
    { Header: "Hora inicio", accessor: "hora_inicio" },
    {
      Header: "Hora finalización",
      accessor: "hora_finalizacion",
    },
    { Header: "Observaciones", accessor: "observaciones" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }: { row: { original: Visita } }) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEliminar(Number(row.original.numero_visita))}
            className="bg-red-500 text-white p-1 rounded"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const visitasForm = [
    { Header: "N° visita", accessor: "numero_visita" },
    { Header: "Fecha", accessor: "fecha" },
    { Header: "Hora inicio", accessor: "hora_inicio" },
    {
      Header: "Hora finalización",
      accessor: "hora_finalizacion",
    },
    { Header: "Observaciones", accessor: "observaciones" },
  ];

  return (
  <div className="mx-10 mt-2 border rounded-2xl shadow-sm p-4">
    <div className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm px-6 py-3 mb-6">
      <p className="text-gray-800 text-sm font-medium text-center">
        VISITAS REALIZADAS PARA COMPLETAR EL CENSO
      </p>
    </div>

    <div className="space-y-6">
      {/* Tabla de visitas */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-2">
        <ReusableTable
          data={visitas || []}
          columns={visitasHeader}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <button
          onClick={agregarVisitaModal}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          + Agregar Visita
        </button>

        <button
          onClick={enviarVisitasABaseDeDatos}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50"
          disabled={visitas.length === 0}
        >
          Guardar Información
        </button>
      </div>
    </div>

    {/* Modal de formulario */}
    <Modal
      isOpen={isModalOpen}
      onRequestClose={cerrarModal}
      contentLabel="Agregar Visita Modal"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl">
        <ReusableForm
          columns={visitasForm}
          onSubmit={manejarEnvio}
          onCancel={cerrarModal}
          initialValues={editingVisita}
        />
      </div>
    </Modal>
  </div>
);

}
