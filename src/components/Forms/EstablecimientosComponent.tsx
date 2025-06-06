"use client";

import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCui,
  setInstitucionesData,
} from "@/redux/slices/espacioEscolarSlice";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusableTable from "../Table/TableReutilizable";
import CuiComponent from "./dinamicForm/CuiComponent";

const EstablecimientosComponent: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );
  const selectedCui = useAppSelector((state) => state.espacio_escolar.cui);
  const dispatch = useAppDispatch();

  // Cargar instituciones desde localStorage si el CUI coincide
  useEffect(() => {
    const stored = localStorage.getItem("institucionesSeleccionadas");
    if (stored) {
      try {
        const {
          cui,
          instituciones,
        }: { cui: number; instituciones: InstitucionesData[] } =
          JSON.parse(stored);
        if (cui === selectedCui) {
          setInstituciones(instituciones);
          dispatch(setInstitucionesData(instituciones));
        } else {
          // Limpiar si el CUI es distinto
          localStorage.removeItem("institucionesSeleccionadas");
          setInstituciones([]);
          dispatch(setInstitucionesData([]));
        }
      } catch (error) {
        console.error("Error al leer instituciones desde localStorage:", error);
      }
    }
  }, [selectedCui, dispatch]);

  console.log("Institucion seleccionada redux:", selectedInstitutionId);


  // Guardar instituciones en localStorage cuando cambien
  useEffect(() => {
    if (instituciones.length > 0 && selectedCui) {
      const dataAGuardar = {
        cui: selectedCui,
        instituciones,
      };
      localStorage.setItem(
        "institucionesSeleccionadas",
        JSON.stringify(dataAGuardar)
      );
      dispatch(setInstitucionesData(instituciones));
    }
  }, [instituciones, selectedCui, dispatch]);

  // Obtener institución al seleccionar una nueva
  /* useEffect(() => {
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
  }, [selectedInstitutionId]); */

  const handleSave = async () => {
    console.log("Instituciones a guardar:", selectedInstitutionId);
    if (selectedInstitutionId && selectedCui) {
      const yaExiste = instituciones.some(
        (inst) => inst.id === selectedInstitutionId
      );
      if (yaExiste) {
        toast.info("La institución ya fue agregada.");
        return;
      }

      try {
        const response = await fetch(
          `/api/instituciones/${selectedInstitutionId}`
        );
        if (!response.ok) throw new Error("No se pudo obtener la institución.");

        const data: InstitucionesData = await response.json();

        const nuevasInstituciones = [...instituciones, data];
        setInstituciones(nuevasInstituciones);
        dispatch(setInstitucionesData(nuevasInstituciones)); // <- 🔥 este es el paso que faltaba
        localStorage.setItem(
          "institucionesSeleccionadas",
          JSON.stringify({
            cui: selectedCui,
            instituciones: nuevasInstituciones,
          })
        );

        toast.success("¡Institución agregada exitosamente!");
        closeModal();
      } catch (error) {
        console.error("Error al guardar la institución:", error);
        toast.error("Ocurrió un error al guardar.");
      }
    } else {
      toast.error("Por favor, selecciona una institución.");
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleRemoveInstitution = (id: number) => {
    const nuevasInstituciones = instituciones.filter(
      (institution) => institution.id !== id
    );
    setInstituciones(nuevasInstituciones);
    toast.success("¡Institución eliminada!");
  };

  const establecimientos_columns = [
    {
      Header: "Establecimiento",
      accessor: "institucion",
    },
    {
      Header: "Modalidad/Nivel",
      accessor: "modalidad_nivel",
    },
    { Header: "CUE", accessor: "cue" },
    { Header: "CUI", accessor: "cui" },
    { Header: "Matrícula", accessor: "matricula" },
    { Header: "Calle", accessor: "calle" },
    { Header: "Referencia", accessor: "modalidad_nivel" },
    { Header: "Provincia", accessor: "provincia" },
    {
      Header: "Departamento",
      accessor: "departamento",
    },
    {
      Header: "Localidad/Paraje",
      accessor: "localidad",
    },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }: { row: { original: { id: number } } }) => (
        <button
          onClick={() => handleRemoveInstitution(row.original.id)}
          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300"
        >
          Eliminar
        </button>
      ),
    },
  ];

  if (!instituciones || instituciones.length === 0) {
    return (
      <div className="mx-10 mt-4 text-gray-500">
        <p>No se ha seleccionado ninguna institución.</p>
      </div>
    );
  }

  return (
    <div className="mx-10 mt-4 text-sm">
      <div className="flex mt-2 p-2 border items-center rounded-lg bg-white text-black">
        <div className="w-6 h-6 flex justify-center items-center bg-custom rounded-full text-white">
          <p>B</p>
        </div>
        <div>
          <p className="text-sm font-bold ml-4">ESTABLECIMIENTOS EDUCATIVOS</p>
        </div>
      </div>
      <div className="flex p-2 bg-gray-100 border rounded-lg">
        <p className="text-xs text-gray-600">
          Transcriba de la hoja de ruta el domicilio postal del CUE-Anexos del o
          los directivos respondientes. Si es necesario utilice la columna
          Referencia para especificar el domicilio.
        </p>
      </div>
      <ReusableTable data={instituciones} columns={establecimientos_columns} />
      <div className="flex justify-end mt-6">
        <button
          className="bg-custom hover:bg-custom/50 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          onClick={openModal}
        >
          Agregar establecimiento
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content bg-white p-6 rounded-lg shadow-md w-2/3 max-w-4xl relative"
        overlayClassName="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <CuiComponent
          label={""}
          initialCui={selectedCui}
          onCuiInputChange={(nuevoCui) => dispatch(setCui(nuevoCui))}
          isReadOnly={false}
          sublabel=""
          institucionActualId={selectedInstitutionId}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-custom hover:bg-custom/50 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            onClick={handleSave}
          >
            Guardar
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
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
