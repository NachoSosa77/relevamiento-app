/* eslint-disable @typescript-eslint/no-unused-vars */
import { Respondiente } from "@/interfaces/Respondientes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarRespondiente, eliminarRespondiente } from "@/redux/slices/espacioEscolarSlice";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";


export default function RespondientesDelCuiComponent() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

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
        toast.success("Respondientes enviados correctamente a la base de datos");
      } else {
        toast.error("❌ Falló el envío de respondientes");
      }
    } catch (error) {
      toast.error("❌ Error al enviar los respondientes a la base de datos");
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

  return (
    <div className="mx-10">
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>RESPONDIENTES DEL CUI</p>
        </div>
      </div>
      <div className="flex flex-col p-2 justify-center text-sm">
        <ReusableTable columns={respondientesHeader} data={respondientes || []} />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={agregarRespondente}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Respondente
          </button>
          <button
            onClick={enviarRespondientesABaseDeDatos}
            disabled={!respondientes.length}
            className={`${
              !respondientes.length ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
            } text-white font-bold py-2 px-4 rounded`}
          >
            Enviar a base de datos
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
            columns={respondientesHeader}
            onSubmit={manejarEnvio}
            onCancel={cerrarModal}
          />
        </div>
      </Modal>
    </div>
  );
}
