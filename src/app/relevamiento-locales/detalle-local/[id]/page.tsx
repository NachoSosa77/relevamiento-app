/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import Navbar from "@/components/NavBar/NavBar";
import { localesService } from "@/services/localesServices"; // Asegúrate de que este import esté correcto según tu estructura de proyecto
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AcondicionamientoTermico from "../../components/AcondicionamientoTermico";
import Dimensiones from "../../components/Dimensiones";
import EquipamientoCantidad from "../../components/EquipamientoCantidad";
import EquipamientoCantidadSanitarios from "../../components/EquipamientoCantidadSanitarios";
import IluminacionVentilacion from "../../components/IlumicacionVentilacion";
import ServiciosBasicos from "../../components/InstalacionesBasicas";
import SistemaContraRobo from "../../components/SistemaContraRobo";
import TableCantidadReutilizable from "../../components/TablaCantidadReutilizable";
import TableReutilizable from "../../components/TableReutilizable";
import {
  equipamientoCocina,
  equipamientoSanitario,
} from "../../config/equipamientoCocina";
import { tipoAcondicionamiento } from "../../config/tipoAcondicionamiento";
import { tipo_ilumincacion } from "../../config/tipoIlumincaion";
import { tipoAberturas, tipoMateriales } from "../../config/tipoMateriales";
import { tipoServiciosBasicos } from "../../config/tipoServiciosBasicos";
import { tipo_Sistema_Contra_Robo } from "../../config/tipoSistemaContraRobo";

const DetalleLocalPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [local, setLocal] = useState<any | null>(null);
  const [aulaComúnField, setAulaComúnField] = useState<string>(""); // El campo adicional para "Aula común"
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<
    "Si" | "No" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Asegúrate de que el id esté disponible

    const fetchLocal = async () => {
      setLoading(true);
      try {
        const fetchedLocal = await localesService.getLocalById(Number(id));
        setLocal(fetchedLocal.local);
      } catch (error) {
        setError("No se pudo cargar el local.");
      }
      setLoading(false);
    };

    fetchLocal();
  }, [id]);

  const handleAulaComúnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAulaComúnField(e.target.value);
  };

  const obtenerDestinoOriginal = (): string => {
    if (opcionSeleccionada === "No") return "No";
    if (opcionSeleccionada === "Si")
      return aulaComúnField.trim() || "No especificado";
    return "No especificado"; // en caso de no haber nada seleccionado
  };

  const handleGuardar = async () => {
    const valorAGuardar = obtenerDestinoOriginal();
    console.log("Destino Original a guardar:", valorAGuardar);

    try {
      const response = await localesService.updateConstruccionById(local.id, {
        destino_original: valorAGuardar,
      });
      // Manejar la respuesta (si es necesario)
      toast("Información guardada correctamente");
    } catch (error) {
      console.error(error);
      toast("Error al guardar los datos");
    }

    // luego harás el PUT acá
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="h-full bg-white text-black text-sm">
      <Navbar />
      <div className="justify-center mt-20 mb-8 mx-4">
        <div className="mx-10 mt-10">
          <div className="flex justify-start mt-10">
            <button
              onClick={handleBack}
              className="bg-blue-500 text-sm text-white font-bold px-4 py-2 rounded-md"
            >
              Volver
            </button>
          </div>
          <div className="flex justify-center">
            <h1 className="text-lg font-semibold mb-4">
              Local seleccionado: {local?.id ?? "N/A"}{" "}
            </h1>
          </div>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-left bg-white">
              <tbody>
                <tr className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Número de local
                  </th>
                  <td className="px-4 py-2">{local?.id ?? "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Descripción
                  </th>
                  <td className="px-4 py-2">{local?.nombre_local ?? "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">CUI</th>
                  <td className="px-4 py-2">{local?.cui_number ?? "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">Tipo</th>
                  <td className="px-4 py-2">{local?.tipo ?? "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Mostrar el campo adicional solo si el local seleccionado es de tipo "Aula común" */}
      {local?.nombre_local === "Aula común" && (
        <div className="mt-4 mx-10">
          <div className="flex items-center justify-center gap-4 border p-3 rounded">
            <label className="text-sm font-semibold">
              ¿Tuvo este local un destino original, diferente al actual?:
            </label>
            {/* Radio "No" */}
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="destinoOriginal"
                value="No"
                checked={opcionSeleccionada === "No"}
                onChange={() => setOpcionSeleccionada("No")}
              />
              No
            </label>

            {/* Radio "Sí" */}
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="destinoOriginal"
                value="Si"
                checked={opcionSeleccionada === "Si"}
                onChange={() => setOpcionSeleccionada("Si")}
              />
              Sí
            </label>

            {/* Input solo si es "Sí" */}
            {opcionSeleccionada === "Si" && (
              <input
                type="text"
                placeholder="Indique:"
                value={aulaComúnField}
                onChange={handleAulaComúnChange}
                className="border px-2 py-1 rounded w-1/3 text-sm"
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={handleGuardar}
                className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
              >
                Guardar Información
              </button>
            </div>
          </div>
        </div>
      )}

      <Dimensiones />
      <TableReutilizable
        id={3}
        label="MATERIALES PREDOMINANTES"
        locales={tipoMateriales}
      />
      <TableCantidadReutilizable
        id={4}
        label="ABERTURAS"
        locales={tipoAberturas}
      />
      <IluminacionVentilacion
        id={5}
        label="CONDICIONES DE ILUMINACIÓN Y VENTILACIÓN"
        locales={tipo_ilumincacion}
      />
      <AcondicionamientoTermico
        id={6}
        label="ACONDICIONAMIENTO TÉRMICO"
        locales={tipoAcondicionamiento}
      />
      {local?.tipo === "Pedagógico" && (
        <SistemaContraRobo
          id={7}
          label="SISTEMA DE PROTECCIÓN CONTRA ROBO"
          locales={tipo_Sistema_Contra_Robo}
        />
      )}

      <ServiciosBasicos
        id="8"
        sub_id={8.1}
        label="INSTALACIONES BÁSICAS"
        locales={tipoServiciosBasicos}
      />
      {(local?.nombre_local === "Cocina" ||
        local?.nombre_local === "Office") && (
        <EquipamientoCantidad
          id={9}
          label="EQUIPAMIENTO DE COCINA/OFFICES"
          locales={equipamientoCocina}
        />
      )}

      {(local?.nombre_local === "Sanitarios Alumnos" ||
        local?.nombre_local === "Sanitarios docentes/personal") && (
          <EquipamientoCantidadSanitarios
            id={10}
            label="EQUIPAMIENTO SANITARIO"
            locales={equipamientoSanitario}
          />
        )}
    </div>
  );
};

export default DetalleLocalPage;
