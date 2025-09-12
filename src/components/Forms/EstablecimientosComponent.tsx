/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setInstitucionesData } from "@/redux/slices/espacioEscolarSlice";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EstablecimientosSkeleton from "../Skeleton/EstablecimientosSkeleton";
import ReusableTable from "../Table/TableReutilizable";
import Spinner from "../ui/Spinner";
import CuiComponent from "./dinamicForm/CuiComponent";

const EstablecimientosComponent: React.FC = () => {
  const [cuiFromDB, setCuiFromDB] = useState<number>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [editando, setEditando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guardandoRelaciones, setGuardandoRelaciones] = useState(false);

  const selectedInstitutionId = useAppSelector(
    (state) => state.institucion.institucionSeleccionada
  );

  const dispatch = useAppDispatch();
  const relevamientoId = useRelevamientoId();

  // 1️⃣ Obtener CUI del relevamiento
  useEffect(() => {
    if (!relevamientoId) return;
    const fetchCui = async () => {
      const res = await fetch(`/api/relevamientos/id/${relevamientoId}`);
      const data = await res.json();
      setCuiFromDB(data?.cui_id ?? null);
    };
    fetchCui();
  }, [relevamientoId]);

  // 2️⃣ Obtener instituciones guardadas del relevamiento, filtradas por CUI
  useEffect(() => {
    const fetchInstitucionesGuardadas = async () => {
      if (!relevamientoId || cuiFromDB === undefined) return;

      try {
        const res = await fetch(
          `/api/instituciones_por_relevamiento/${relevamientoId}`
        );
        if (!res.ok) throw new Error("Error al obtener instituciones guardadas");

        const data: InstitucionesData[] = await res.json();
        if (data.length > 0) {
          const filtradas = data.filter((inst) => inst.cui === cuiFromDB);
          setEditando(true);
          setInstituciones(filtradas);
        }
      } catch (err) {
        console.error("Error al cargar instituciones guardadas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitucionesGuardadas();
  }, [relevamientoId, cuiFromDB]);

  // 3️⃣ Guardar estado local en Redux y localStorage
  useEffect(() => {
    dispatch(setInstitucionesData(instituciones));
    localStorage.setItem(
      "institucionesSeleccionadas",
      JSON.stringify({ cui: cuiFromDB, instituciones })
    );
  }, [instituciones, dispatch, cuiFromDB]);

  // 4️⃣ Agregar institución filtrando por CUI
  const agregarInstitucion = (data: InstitucionesData) => {
    if (data.cui !== cuiFromDB) return;

    setInstituciones((prev) => {
      if (prev.some((inst) => inst.id === data.id)) return prev;
      toast.success("¡Institución agregada!");
      return [...prev, data];
    });
  };

  // 5️⃣ Manejar click guardar del modal
  const handleSave = async () => {
    if (loading) return;
    if (!selectedInstitutionId || cuiFromDB === undefined) {
      toast.error("Por favor, selecciona una institución.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/instituciones/${selectedInstitutionId}`);
      if (!response.ok) throw new Error("No se pudo obtener la institución.");

      const data: InstitucionesData = await response.json();
      agregarInstitucion(data);
      closeModal();
    } catch (error) {
      console.error("Error al guardar la institución:", error);
      toast.error("Ocurrió un error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  // 6️⃣ Modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // 7️⃣ Eliminar institución
  const handleRemoveInstitution = (id: number) => {
    setInstituciones((prev) => {
      const nuevas = prev.filter((inst) => inst.id !== id);
      toast.success("¡Institución eliminada!");
      return nuevas;
    });
  };

  // 8️⃣ Columnas tabla
  const establecimientos_columns = [
    { Header: "Establecimiento", accessor: "institucion" },
    { Header: "Modalidad/Nivel", accessor: "modalidad_nivel" },
    { Header: "CUE", accessor: "cue" },
    { Header: "CUI", accessor: "cui" },
    { Header: "Matrícula", accessor: "matricula" },
    { Header: "Calle", accessor: "calle" },
    { Header: "Referencia", accessor: "modalidad_nivel" },
    { Header: "Provincia", accessor: "provincia" },
    { Header: "Departamento", accessor: "departamento" },
    { Header: "Localidad/Paraje", accessor: "localidad" },
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

  // 9️⃣ Guardar relaciones en backend
  const handleGuardarRelaciones = async () => {
    setGuardandoRelaciones(true);
    if (!relevamientoId || instituciones.length === 0) {
      toast.error("No hay instituciones para guardar.");
      setGuardandoRelaciones(false);
      return;
    }

    try {
      const response = await fetch("/api/instituciones_por_relevamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relevamiento_id: relevamientoId,
          instituciones: instituciones.map((i) => i.id),
        }),
      });

      if (!response.ok) throw new Error("Error al guardar las relaciones");
      toast.success("¡Relaciones guardadas correctamente!");
    } catch (error) {
      console.error("Error al guardar relaciones:", error);
      toast.error("Hubo un error al guardar las relaciones.");
    } finally {
      setGuardandoRelaciones(false);
    }
  };

  if (isLoading) return <EstablecimientosSkeleton />;

  return (
    <div className="mx-10 mt-4 text-sm">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded text-sm text-center">
          Estás editando establecimientos ya relevados anteriormente.
        </div>
      )}
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
      <div className="flex justify-end mt-6 space-x-2">
        <button
          className="bg-custom hover:bg-custom/50 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          onClick={openModal}
        >
          Agregar establecimiento
        </button>
        <button
          className={`flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-full transition duration-300 ${
            guardandoRelaciones
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={handleGuardarRelaciones}
          disabled={instituciones.length === 0 || guardandoRelaciones}
        >
          {guardandoRelaciones ? (
            <>
              <Spinner /> Guardando...
            </>
          ) : (
            "Guardar información"
          )}
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
          label=""
          initialCui={cuiFromDB}
          onCuiInputChange={() => {}}
          isReadOnly={false}
          sublabel=""
          institucionActualId={selectedInstitutionId}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className={`font-bold py-2 px-4 rounded-full transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-custom hover:bg-custom/50 text-white"
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
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
