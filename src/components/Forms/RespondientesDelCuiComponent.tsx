import { respondientesHeader } from "@/app/relevamiento-predio/config/respondientesHeader";
import { Respondentes } from "@/interfaces/Respondientes";
import { useState } from "react";
import Modal from "react-modal";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

export default function RespondientesDelCuiComponent() {
  const [respondentes, setRespondentes] = useState<Respondentes[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
  /* const handleSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    // Aquí puedes enviar los datos a tu servidor o realizar otras acciones
  }; */

  const agregarRespondente = () => {
      setIsModalOpen(true);
    };
  
    const cerrarModal = () => {
      setIsModalOpen(false);
    }
    
    const manejarEnvio = (nuevoRespondente: Respondentes) => {
      setRespondentes([...respondentes, nuevoRespondente]);
      cerrarModal();
    };

  return (
    <div className="mx-10">
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>RESPONDIENTES DEL CUI</p>
        </div>
      </div>
      <div className="flex flex-col p-2 justify-center items-cente text-sm">
        <ReusableTable
          columns={respondientesHeader}
          data={respondentes}
        />
        <button
          onClick={agregarRespondente}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Respondente
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cerrarModal}
        contentLabel="Agregar Visita Modal"
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
