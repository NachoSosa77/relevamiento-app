"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { Respondiente } from "@/interfaces/Respondientes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  agregarRespondiente,
  eliminarRespondiente,
  setRespondientes,
} from "@/redux/slices/espacioEscolarSlice";

import Skeleton from "react-loading-skeleton";
import ReusableTable from "../Table/TableReutilizable";
import ReusableForm from "./ReusableForm";

export default function RespondientesDelCuiComponent() {
  const dispatch = useAppDispatch();
  const relevamientoId = useRelevamientoId();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  const respondientes = useAppSelector(
    (state) => state.espacio_escolar.respondientes
  );

  useEffect(() => {
    const cargarRespondientesDesdeDB = async () => {
      if (!relevamientoId) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/respondientes/${relevamientoId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data) && data.length > 0) {
          dispatch(setRespondientes(data));
          setEditando(true);
        }
      } catch (error) {
        console.error("Error al cargar respondientes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRespondientesDesdeDB();
  }, [dispatch, relevamientoId]);

  const agregarRespondente = () => setIsModalOpen(true);
  const cerrarModal = () => setIsModalOpen(false);

  const manejarEnvio = (nuevo: Respondiente) => {
    if (!relevamientoId) {
      toast.error("❌ Relevamiento ID no disponible.");
      return;
    }

    dispatch(
      agregarRespondiente({ ...nuevo, relevamiento_id: relevamientoId })
    );
    cerrarModal();
  };

  const handleEliminar = (index: number) => {
    dispatch(eliminarRespondiente(index));
  };

  const enviarRespondientesABaseDeDatos = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!respondientes.length || !relevamientoId) {
      toast.error("❌ No hay respondientes o relevamiento no definido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/respondientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondientes: respondientes.map((r) => ({
            ...r,
            relevamiento_id: relevamientoId,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) toast.success("Respondientes guardados correctamente ✅");
      else toast.error("❌ Error al guardar respondientes");
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("❌ Error inesperado al enviar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const respondientesHeader = [
    { Header: "Nombre y apellido", accessor: "nombre_completo" },
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
        <button
          onClick={() => handleEliminar(row.index)}
          className="bg-red-500 text-white p-1 rounded"
        >
          Eliminar
        </button>
      ),
    },
  ];

  const respondientesForm = [
    { Header: "Nombre y apellido", accessor: "nombre_completo" },
    { Header: "Cargo", accessor: "cargo" },
    {
      Header: "Denominación del establecimiento educativo",
      accessor: "establecimiento",
    },
    { Header: "Teléfono de contacto", accessor: "telefono" },
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
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      <div className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm px-6 py-3 mb-6">
        <p className="text-gray-800 text-sm font-medium text-center">
          RESPONDIENTES DEL CUI
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-2">
        <ReusableTable data={respondientes} columns={respondientesHeader} />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={agregarRespondente}
            className="bg-custom hover:bg-custom/50 text-white text-sm font-semibold py-2 px-4 rounded-xl"
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
            } text-white text-sm font-semibold py-2 px-4 rounded-xl disabled:opacity-50`}
          >
            {isSubmitting ? "Guardando..." : "Guardar información"}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cerrarModal}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
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
