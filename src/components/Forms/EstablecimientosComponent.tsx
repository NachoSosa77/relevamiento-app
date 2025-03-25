"use client";

import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import ESTABLECIMIENTOS_COLUMNS, {
  default as establecimientos_columns,
} from "../Table/TableColumns/establecimientosColumns";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

const EstablecimientosComponent: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [institucion, setInstitucion] = useState<InstitucionesData | null>(null);
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`/api/instituciones/${selectedInstitutionId}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la institución.");
        }
        const data: InstitucionesData = await response.json();
        setInstitucion(data);
      } catch (error) {
        console.error("Error fetching institution:", error);
      }
    };

    if (selectedInstitutionId) {
      fetchInstitution();
    }
  }, [selectedInstitutionId]);

  const handleAddInstitution = (newInstitution: InstitucionesData) => {
    // Lógica para agregar la institución (si es necesario)
    closeModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!institucion) {
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
      <ReusableTable data={[institucion]} columns={ESTABLECIMIENTOS_COLUMNS} />
      <div className="flex justify-end">
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
        className="modal-content bg-white p-4 rounded-lg shadow-md w-fit max-w-md relative"
        overlayClassName="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <ReusableForm
          columns={establecimientos_columns}
          onSubmit={handleAddInstitution}
          onCancel={closeModal}
          initialValues={institucion}
        />
      </Modal>
    </div>
  );
};

export default EstablecimientosComponent;