"use client";

import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setInstitucionesData } from "@/redux/slices/espacioEscolarSlice";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importar el estilo para el toast
import { default as establecimientos_columns } from "../Table/TableColumns/establecimientosColumns";
import ReusableTable from "../Table/TableReutilizable";
import CuiComponent from "./dinamicForm/CuiComponent";

const EstablecimientosComponent: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cuiInputValue, setCuiInputValue] = useState<number | undefined>(
    undefined
  ); // Valor del input CUI
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  const dispatch = useAppDispatch();

  //console.log("INSTITUCIONES", selectedInstitutionId);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(
          `/api/instituciones/${selectedInstitutionId}`
        );
        if (!response.ok) {
          throw new Error("No se pudo obtener la institución.");
        }
        const data: InstitucionesData = await response.json();

        setInstituciones((prev) => {
          if (!prev.some((inst) => inst.id === data.id)) {
            return [...prev, data];
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching institution:", error);
      }
    };

    if (selectedInstitutionId) {
      fetchInstitution();
    }
  }, [selectedInstitutionId]);

  const handleCuiInputChange = (newCui: number | undefined) => {
    setCuiInputValue(newCui);
  };

  const handleSave = () => {
    if (cuiInputValue) {
      toast.success("¡Institución agregada exitosamente!");
      closeModal();
    } else {
      toast.error("Por favor, selecciona una institución.");
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (instituciones.length > 0) {
      dispatch(setInstitucionesData(instituciones));
    }
  }, [instituciones, dispatch]);

  if (!instituciones) {
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
      <ReusableTable data={instituciones} columns={establecimientos_columns} />
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
        className="modal-content bg-white p-4 rounded-lg shadow-md w-2/3 max-w-4xl relative"
        overlayClassName="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        {/* <ReusableForm
          columns={establecimientos_columns}
          onSubmit={handleAddInstitution}
          onCancel={closeModal}
          initialValues={institucion}
        /> */}
        <CuiComponent
          label={""}
          initialCui={cuiInputValue} // Pasa el valor inicial del CUI
          onCuiInputChange={handleCuiInputChange} // Pasa la función para actualizar el CUI
          isReadOnly={false}
          sublabel=""
        />
        <div className="flex justify-center space-x-4 mt-4">
          {" "}
          {/* Flex container para centrar los botones */}
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={handleSave} // Llama a handleSave aquí
          >
            Guardar
          </button>
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EstablecimientosComponent;
