 
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
      toast.success("✅ Visita actualizada correctamente en Redux");
    } else {
      // Si no estamos editando, la agregamos como nueva
      dispatch(agregarVisita(visitaConRelevamiento));
      toast.success("✅ Visita agregada correctamente en Redux");
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
        toast.success("✅ Visitas enviadas correctamente a la base de datos");
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

  return (
    <div className="mx-10">
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>VISITAS REALIZADAS PARA COMPLETAR EL CENSO</p>
        </div>
      </div>

      <div className="flex flex-col p-2 justify-center text-sm">
        {/* Mostrar las visitas agregadas en Redux */}
        <ReusableTable
          data={visitas || []}
          columns={visitasHeader} // Añadimos botones de editar y eliminar en cada fila
        />

        <div className="flex space-x-4 justify-end">
          <button
            onClick={agregarVisitaModal}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end"
          >
            Agregar Visita
          </button>

          <button
            onClick={enviarVisitasABaseDeDatos}
            className="mt-2 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded self-end"
            disabled={visitas.length === 0} // Deshabilitado si no hay visitas
          >
            Enviar Visitas a la Base de Datos
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cerrarModal}
        contentLabel="Agregar Visita Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white p-6 rounded-xl w-1/2 shadow-lg">
          <ReusableForm
            columns={visitasHeader}
            onSubmit={manejarEnvio} // Solo estamos agregando visitas a Redux
            onCancel={cerrarModal}
            initialValues={editingVisita} // Pasamos los datos para editar
          />
        </div>
      </Modal>
    </div>
  );
}
