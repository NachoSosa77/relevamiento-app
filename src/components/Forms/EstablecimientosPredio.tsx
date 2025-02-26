"use client";

import { establecimientosHeader } from "@/app/relevamiento-predio/config/establecimientosHeader";
import { InstitucionesData } from "@/interfaces/Instituciones"; // Importa la interfaz
import { useMemo, useState } from "react";
import Modal from "react-modal";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

interface EstablecimientosComponentProps {
  selectedInstitution: InstitucionesData | null;
}
const EstablecimientosPredio: React.FC<EstablecimientosComponentProps> = ({
  selectedInstitution,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la apertura del modal
  const [newInstitutions, setNewInstitutions] = useState<InstitucionesData[]>([]);
  
  const institutionsToDisplay = useMemo(() => {
    if (!selectedInstitution) return [];
    return [selectedInstitution, ...newInstitutions];
  }, [selectedInstitution, newInstitutions]);
  

  const handleAddInstitution = (newInstitution: InstitucionesData) => {
    setNewInstitutions([...newInstitutions, newInstitution]);
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
      <div className="flex mt-2 border items-center">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black font-bold">
          <p>C</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            ESTABLECIMIENTOS QUE FUNCIONAN EN EL PREDIO
          </p>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta la denominación de los establecimientos
          educativos que funcionan en el predio y el Número de CUE-Anexo de cada
          uno de ellos. En caso de que el directivo mencione un CUE-Anexo
          usuario que no está consignado en la Hoja de ruta, se deberá agregar,
          completando los datos correspondientes.
        </p>
      </div>
       <ReusableTable
        data={institutionsToDisplay}
        columns={establecimientosHeader}
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
          columns={establecimientosHeader}
          onSubmit={handleAddInstitution}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default EstablecimientosPredio;
