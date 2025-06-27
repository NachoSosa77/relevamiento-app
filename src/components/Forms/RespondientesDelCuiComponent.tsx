/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { Respondiente } from "@/interfaces/Respondientes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  agregarRespondiente,
  eliminarRespondiente,
} from "@/redux/slices/espacioEscolarSlice";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

export default function RespondientesDelCuiComponent() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relevamientoId = useRelevamientoId();

  const respondientes = useAppSelector(
    (state) => state.espacio_escolar.respondientes
  );

  const agregarRespondente = () => {
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  const manejarEnvio = (nuevoRespondente: Respondiente) => {
    if (!relevamientoId) {
      toast.error("❌ Relevamiento ID no disponible.");
      return;
    }

    const respondienteConRelevamiento = {
      ...nuevoRespondente,
      relevamiento_id: relevamientoId,
    };

    dispatch(agregarRespondiente(respondienteConRelevamiento));
    cerrarModal();
  };

  const handleEliminar = (index: number) => {
    dispatch(eliminarRespondiente(index));
  };

  const enviarRespondientesABaseDeDatos = async () => {
    if (isSubmitting) return; // previene doble click
    setIsSubmitting(true);

    if (!respondientes.length || !relevamientoId) {
      toast.error("❌ No hay respondientes o Relevamiento ID no disponible.");
      return;
    }

    try {
      const respondientesConId = respondientes.map((r) => ({
        ...r,
        relevamiento_id: relevamientoId,
      }));

      const response = await axios.post("/api/respondientes", {
        respondientes: respondientesConId,
      });

      if (response.status === 200 && response.data.success) {
        toast.success(
          "Respondientes enviados correctamente a la base de datos"
        );
      } else {
        toast.error("❌ Falló el envío de respondientes");
      }
    } catch (error) {
      toast.error("❌ Error al enviar los respondientes a la base de datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const respondientesHeader = [
    {
      Header: "Nombre y apellido",
      accessor: "nombre_completo",
    },
    { Header: "Cargo", accessor: "cargo" },
    {
      Header: "Denominación del establecimiento educativo",
      accessor: "establecimiento",
    },
    { Header: "Teléfono de contacto", accessor: "telefono" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }: { row: { original: Respondiente; index: number } }) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEliminar(row.index)}
            className="bg-red-500 text-white p-1 rounded"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];
  const respondientesForm = [
    {
      Header: "Nombre y apellido",
      accessor: "nombre_completo",
    },
    { Header: "Cargo", accessor: "cargo" },
    {
      Header: "Denominación del establecimiento educativo",
      accessor: "establecimiento",
    },
    { Header: "Teléfono de contacto", accessor: "telefono" },
  ];

  return (
    <div className="mx-10 mt-2 border rounded-2xl shadow-sm p-4">
      <div className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm px-6 py-3 mb-6">
        <p className="text-gray-800 text-sm font-medium text-center">
          RESPONDIENTES DEL CUI
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-2">
        <ReusableTable
          columns={respondientesHeader}
          data={respondientes || []}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={agregarRespondente}
            className="bg-custom hover:bg-custom/50 text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            + Agregar Respondente
          </button>
          <button
            onClick={enviarRespondientesABaseDeDatos}
            disabled={!respondientes.length}
            className={`${
              !respondientes.length
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            } text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50`}
          >
            {isSubmitting ? "Guardando..." : "Guardar información"}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cerrarModal}
        contentLabel="Agregar Respondente Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white p-4 rounded w-1/2">
          <ReusableForm
            columns={respondientesForm}
            onSubmit={manejarEnvio}
            onCancel={cerrarModal}
          />
        </div>
      </Modal>
    </div>
  );
}
