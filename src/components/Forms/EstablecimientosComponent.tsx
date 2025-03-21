"use client";


import { InstitucionesData } from "@/interfaces/Instituciones"; // Importa la interfaz
import { useState } from "react";
import Modal from "react-modal";
import {
  default as ESTABLECIMIENTOS_COLUMNS,
  default as establecimientos_columns,
} from "../Table/TableColumns/establecimientosColumns";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

interface EstablecimientosComponentProps {
  selectedInstitution: InstitucionesData | null;
}

const EstablecimientosComponent: React.FC<EstablecimientosComponentProps> = ({
  selectedInstitution,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la apertura del modal
  const [institutions, setInstitutions] = useState(
    selectedInstitution ? [selectedInstitution] : []
  ); // Estado para almacenar las instituciones

  const handleAddInstitution = (newInstitution: InstitucionesData) => {
    setInstitutions([...institutions, newInstitution]); // Agrega la nueva institución al array
    closeModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!selectedInstitution) {
    // Manejar el caso en que selectedInstitution es null
    return (
      <div className="mx-10 mt-4">
        <p>No se ha seleccionado ninguna institución.</p>
      </div>
    );
  }

  return (
    <div className="mx-10 mt-4 text-sm">
      <div className="flex mt-2 p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>B</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            ESTABLECIMIENTOS EDUCATIVOS
          </p>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta el domicilio postal del CUE-Anexos del o
          los directivos respondientes. Si es necesario utilice la columna
          Referencia para especificar el domicilio.
        </p>
      </div>
      <ReusableTable
        data={[selectedInstitution]}
        columns={ESTABLECIMIENTOS_COLUMNS}
      />
      <div className="flex justify-end">
        {/* Contenedor flex para alinear a la derecha */}
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Agregar establecimiento
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content bg-white p-4 rounded-lg shadow-md w-fit max-w-md relative" // Clase para estilos
        overlayClassName="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" // Centrado vertical y horizontal
        ariaHideApp={false}
      >
        <ReusableForm
          columns={establecimientos_columns}
          onSubmit={handleAddInstitution}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default EstablecimientosComponent;
