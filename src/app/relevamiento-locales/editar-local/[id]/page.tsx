/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Navbar from "@/components/NavBar/NavBar";
import Spinner from "@/components/ui/Spinner";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AberturasEditable from "../../components/AberturasEditable";
import AcondicionamientoTermicoEditable from "../../components/AcondicionamientoTermicoEditable";
import DimensionesEditable from "../../components/DimensionesEditables";
import EquipamientoCocinaEditable from "../../components/EquipamientoCocinaEditable";
import EquipamientoSanitarioEditable from "../../components/EquipamientoSanitariosEditable";
import IluminacionEditable from "../../components/IluminacionEditable";
import InstalacionesBasicasEditable from "../../components/InstalacionesBasicasEditable";
import LocalInfoEditable from "../../components/LocalInfoEditable";
import MaterialesPredominantesEditable from "../../components/MaterialesPredominantesEditable";

const EditarLocalPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [local, setLocal] = useState<LocalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localId = id;
  const relevamientoId = useRelevamientoId();

  interface LocalDetail {
    id: number;
    nombre_local: string;
    [key: string]: any; // si hay más campos dinámicos
  }

  const fetchLocal = useCallback(async () => {
    if (!localId || !relevamientoId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/locales_por_construccion/${localId}/local?relevamientoId=${relevamientoId}`
      );
      if (!res.ok) throw new Error("Error al traer el local");
      const data: { local: LocalDetail } = await res.json();
      setLocal(data.local);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [localId, relevamientoId]);

  useEffect(() => {
    fetchLocal();
  }, [fetchLocal]);

  const handleBack = () => router.back();

  if (loading)
    return (
      <div className="mt-32 flex flex-col items-center justify-center">
        <Spinner />
        <span className="mt-2">Cargando local...</span>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-32">
        Error al cargar el local: {error}
      </p>
    );

  // Validar que local exista
  if (!local) return null;

  const localNumericId = Number(local.id);

  return (
    <div className="h-full bg-white text-black text-sm mt-32">
      <Navbar />
      <div className="mx-10 mt-10">
        <div className="flex justify-start mt-10 mb-4">
          <button
            onClick={handleBack}
            className="bg-custom hover:bg-custom/50 text-sm text-white font-bold px-4 py-2 rounded-md"
          >
            Volver
          </button>
        </div>
        <h1 className="font-bold mb-4">Relevamiento N° {relevamientoId}</h1>
      </div>

      {/* Sección editable del local */}
      <LocalInfoEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <DimensionesEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <MaterialesPredominantesEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <AberturasEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <IluminacionEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <AcondicionamientoTermicoEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <InstalacionesBasicasEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />
      <EquipamientoCocinaEditable
        localId={localNumericId}
        relevamientoId={relevamientoId!}
      />

      {(local.nombre_local === "Sanitarios Alumnos" ||
        local.nombre_local === "Sanitarios docentes/personal" ||
        local.nombre_local === "Sala de nivel inicial" ||
        local.nombre_local === "Laboratorio" ||
        local.nombre_local === "Aula especial") && (
        <EquipamientoSanitarioEditable
          localId={localNumericId}
          relevamientoId={relevamientoId!}
        />
      )}
    </div>
  );
};

export default EditarLocalPage;
