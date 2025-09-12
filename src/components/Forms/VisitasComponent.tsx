/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { Visita } from "@/interfaces/Visitas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  actualizarVisita,
  agregarVisita,
  eliminarVisita,
  setVisitas,
} from "@/redux/slices/espacioEscolarSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

export default function VisitasComponent() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  const relevamientoId = useRelevamientoId();
  const visitas = useAppSelector((state) => state.espacio_escolar.visitas);

  useEffect(() => {
    const cargarVisitasDesdeDB = async () => {
      if (!relevamientoId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/visitas?relevamientoId=${relevamientoId}`
        );

        if (!response.ok) throw new Error("Error al obtener visitas");

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          dispatch(setVisitas(data));
          setEditando(true);
        }
      } catch (error) {
        console.error("Error al cargar visitas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarVisitasDesdeDB();
  }, [relevamientoId, dispatch]);

  const agregarVisitaModal = () => {
    setEditingVisita(null);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingVisita(null);
  };

  const manejarEnvio = (nuevaVisita: Visita) => {
    if (!relevamientoId) {
      toast.error("❌ Relevamiento ID no disponible.");
      return;
    }

    const { numero_visita, fecha, hora_inicio, hora_finalizacion } = nuevaVisita;

    if (
      numero_visita === undefined ||
      fecha?.trim() === "" ||
      hora_inicio?.trim() === "" ||
      hora_finalizacion?.trim() === ""
    ) {
      toast.warning("Completá todos los campos obligatorios.");
      return;
    }

    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!horaRegex.test(hora_inicio) || !horaRegex.test(hora_finalizacion)) {
      toast.warning("Las horas deben tener formato HH:MM.");
      return;
    }

    const visitaConRelevamiento = { ...nuevaVisita, relevamiento_id: relevamientoId };

    if (editingVisita) dispatch(actualizarVisita(visitaConRelevamiento));
    else dispatch(agregarVisita(visitaConRelevamiento));

    cerrarModal();
  };

  const handleEliminar = (numero_visita: number) => {
    if (numero_visita === undefined || isNaN(numero_visita)) {
      toast.error("❌ Número de visita no válido.");
      return;
    }
    dispatch(eliminarVisita(numero_visita));
  };

  const enviarVisitasABaseDeDatos = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!visitas || visitas.length === 0 || !relevamientoId) {
      toast.error("❌ No hay visitas o relevamiento ID no disponible.");
      setIsSubmitting(false);
      return;
    }

    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const visitasInvalidas = visitas.filter(
      (v) =>
        v.numero_visita === undefined ||
        v.fecha?.trim() === "" ||
        v.hora_inicio?.trim() === "" ||
        v.hora_finalizacion?.trim() === "" ||
        isNaN(Number(v.numero_visita)) ||
        !horaRegex.test(v.hora_inicio) ||
        !horaRegex.test(v.hora_finalizacion)
    );

    if (visitasInvalidas.length > 0) {
      toast.warning("Hay visitas con campos incompletos o incorrectos. Revisá antes de guardar.");
      setIsSubmitting(false);
      return;
    }

    try {
      const visitasConRelevamiento = visitas.map((v) => ({ ...v, relevamiento_id: relevamientoId }));
      const response = await axios.post("/api/visitas", visitasConRelevamiento);

      if (response.status === 200 && response.data.success)
        toast.success("Visitas enviadas correctamente a la base de datos");
      else {
        console.error("Error desde backend:", response.data);
        toast.error("❌ Hubo un problema al guardar las visitas");
      }
    } catch (error) {
      console.error("❌ Error al enviar visitas:", error);
      toast.error("❌ Error al enviar las visitas a la base de datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  type ColumnType = {
    Header: string;
    accessor: string;
    inputType?: "number" | "date" | "time" | "text";
    Cell?: React.FC<{ value?: any; row: { original: Visita } }>;
  };

  const visitasHeader: ColumnType[] = [
    { Header: "N° visita", accessor: "numero_visita", inputType: "number" },
    { Header: "Fecha", accessor: "fecha", inputType: "date" },
    { Header: "Hora inicio", accessor: "hora_inicio", inputType: "time" },
    { Header: "Hora finalización", accessor: "hora_finalizacion", inputType: "time" },
    { Header: "Observaciones", accessor: "observaciones", inputType: "text" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEliminar(row.original.numero_visita)}
            className="bg-red-500 text-white p-1 rounded"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const visitasForm: ColumnType[] = [
    { Header: "N° visita", accessor: "numero_visita", inputType: "number" },
    { Header: "Fecha", accessor: "fecha", inputType: "date" },
    { Header: "Hora inicio", accessor: "hora_inicio", inputType: "time" },
    { Header: "Hora finalización", accessor: "hora_finalizacion", inputType: "time" },
    { Header: "Observaciones", accessor: "observaciones", inputType: "text" },
  ];

  if (loading) {
    return (
      <div className="mx-10 mt-2 border rounded-2xl shadow-sm p-4 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    );
  }

  return (
    <div className="mx-10 mt-2 border rounded-2xl shadow-sm p-4">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      <div className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm px-6 py-3 mb-6">
        <p className="text-gray-800 text-sm font-medium text-center">
          VISITAS REALIZADAS PARA COMPLETAR EL CENSO
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-2">
          <ReusableTable data={visitas || []} columns={visitasHeader} />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={agregarVisitaModal}
            className="bg-custom hover:bg-custom/50 text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            + Agregar Visita
          </button>

          <button
            onClick={enviarVisitasABaseDeDatos}
            className={`${
              !visitas.length ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50`}
            disabled={!visitas.length}
          >
            {isSubmitting ? "Guardando..." : "Guardar información"}
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
