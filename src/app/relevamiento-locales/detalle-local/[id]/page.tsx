/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import Navbar from "@/components/NavBar/NavBar";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import { localesService } from "@/services/localesServices"; // Asegúrate de que este import esté correcto según tu estructura de proyecto
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const [hayCambios, setHayCambios] = useState(false);
  const localId = id;

  const fetchLocal = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const fetchedLocal = await localesService.getLocalById(Number(id));
      setLocal(fetchedLocal.local);
    } catch (error) {
      setError("No se pudo cargar el local.");
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ id es la única dependencia real

  useEffect(() => {
    fetchLocal();
  }, [fetchLocal]);
  

  const handleSaveObservaciones = async (obs: string) => {
    if (!localId) return;

    try {
      const res = await fetch("/api/locales_por_construccion/observaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localId,
          observaciones: obs,
        }),
      });

      if (res.ok) {
        toast.success("Observaciones guardadas correctamente");
      } else {
        toast.error("Error al guardar observaciones");
      }
    } catch (err) {
      console.error("Error de red al guardar:", err);
    }
  };

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

    try {
      const response = await localesService.updateConstruccionById(local.id, {
        destino_original: valorAGuardar,
      });
      // Manejar la respuesta (si es necesario)
      toast.success("Información guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los datos");
    }
  };

  const handleGuardarLocal = async () => {
  try {
    // Asumiendo que tenés el localId disponible
    await localesService.updateEstadoLocal(local.id, "completo");

    toast.success("Local guardado correctamente");
    router.push("/relevamiento-locales");
  } catch (error) {
    console.error(error);
    toast.error("Error al guardar el local");
  }
};

  const marcarComoModificado = () => {
    setHayCambios(true);
  };

  const handleBack = () => {
    router.back();
  };
  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="h-full bg-white text-black text-sm mt-32">
      <Navbar />
      <div className="justify-center mt-20 mb-8 mx-4">
        <div className="mx-10 mt-10">
          <div className="flex justify-start mt-10">
            <button
              onClick={handleBack}
              className="bg-custom hover:bg-custom/50 text-sm text-white font-bold px-4 py-2 rounded-md"
            >
              Volver
            </button>
          </div>
          <div className="flex justify-center">
            <h1 className="text-lg font-semibold mb-4">
              Local seleccionado: {local?.identificacion_plano ?? "N/A"}{" "}
            </h1>
          </div>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-left bg-white">
              <tbody>
                <tr className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Número de local
                  </th>
                  <td className="px-4 py-2">
                    {local?.identificacion_plano ?? "N/A"}
                  </td>
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
                className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
              >
                Guardar Información
              </button>
            </div>
          </div>
        </div>
      )}

      <Dimensiones onUpdate={marcarComoModificado} />
      <TableReutilizable
        id={3}
        label="MATERIALES PREDOMINANTES"
        locales={tipoMateriales}
        onUpdate={marcarComoModificado}
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
        local?.nombre_local === "Office" || local?.nombre_local === "Otro local pedagógico" || local?.nombre_local === "Oficina" || local?.nombre_local === "Aula especial") && (
        <EquipamientoCantidad
          id={9}
          label="EQUIPAMIENTO DE COCINA/OFFICES"
          locales={equipamientoCocina}
        />
      )}

      {(local?.nombre_local === "Sanitarios Alumnos" ||
        local?.nombre_local === "Sanitarios docentes/personal" || local?.nombre_local === "Aula especial") && (
        <EquipamientoCantidadSanitarios
          id={10}
          label="EQUIPAMIENTO SANITARIO"
          locales={equipamientoSanitario}
        />
      )}

      <ObservacionesComponent onSave={handleSaveObservaciones} />
      {hayCambios && (
        <div className="text-green-600 text-sm mt-2 ml-10">
          Cambios detectados. No olvides guardar.
        </div>
      )}
      <div className="flex justify-center">
        <button
          disabled={!hayCambios}
          onClick={handleGuardarLocal}
          className={`mt-4 ml-10 px-4 py-2 rounded text-sm font-bold ${
            hayCambios
              ? "bg-green-600 text-white hover:bg-green-800"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Actualizar Local
        </button>
      </div>
    </div>
  );
};

export default DetalleLocalPage;
