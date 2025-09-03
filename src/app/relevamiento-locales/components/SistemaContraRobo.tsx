"use client";

import Select from "@/components/ui/SelectComponent";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { localesService } from "@/services/localesServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SistemaContraRoboSkeleton from "./skeletons/SistemaContraRoboSkeleton";

interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  locales: Locales[];
  onUpdate?: () => void;
}

export default function SistemaContraRobo({
  id,
  label,
  locales,
  onUpdate,
}: EstructuraReuProps) {
  const params = useParams();
  const localId = Number(params.id);
  const relevamientoId = useRelevamientoId();

  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<
    Record<string, Opcion | null>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Cargar datos existentes
  useEffect(() => {
    if (!relevamientoId || isNaN(localId)) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/locales_por_construccion/${localId}/local?relevamientoId=${relevamientoId}`
        );
        if (!res.ok) throw new Error("Error al obtener local");
        const { local } = await res.json();

        if (isMounted) {
          const inicial: Record<string, Opcion | null> = {};
          let existeDato = false;

          locales.forEach((l) => {
            // Si el endpoint no trae nada, inicializamos en null
            const opcion = l.opciones.find(
              (opt) => local?.proteccion_contra_robo && opt.name === local.proteccion_contra_robo
            );
            if (opcion) existeDato = true;
            inicial[l.id] = opcion || null;
          });

          setOpcionesSeleccionadas(inicial);
          setIsEditing(existeDato);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar los datos de protección contra robo");
        // Inicializamos vacío para permitir cargar nuevo
        const inicial: Record<string, Opcion | null> = {};
        locales.forEach((l) => {
          inicial[l.id] = null;
        });
        setOpcionesSeleccionadas(inicial);
        setIsEditing(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [localId, locales, relevamientoId]); // <-- locales incluido

  const handleOpcionChange = (value: string, opciones: Opcion[], localId: string) => {
    const seleccionada = opciones.find((opt) => String(opt.id) === value) || null;
    setOpcionesSeleccionadas((prev) => ({
      ...prev,
      [localId]: seleccionada,
    }));
  };

  const handleGuardar = async () => {
    const datosAGuardar = Object.entries(opcionesSeleccionadas).map(
      ([, opcion]) => ({
        id: localId,
        proteccion_contra_robo: opcion?.name || null,
      })
    );

    const hayAlMenosUnDato = datosAGuardar.some(
      (dato) => dato.proteccion_contra_robo && dato.proteccion_contra_robo.trim() !== ""
    );

    if (!hayAlMenosUnDato) {
      toast.warning("Por favor, seleccioná al menos una opción antes de guardar.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      for (const dato of datosAGuardar) {
        await localesService.updateConstruccionAntiRoboById(dato.id, {
          proteccion_contra_robo: dato.proteccion_contra_robo!,
        });
      }
      toast.success(
        isEditing
          ? "Información actualizada correctamente"
          : "Información guardada correctamente"
      );
      onUpdate?.();
      setIsEditing(true);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <SistemaContraRoboSkeleton />;

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
      {isEditing && (
        <div className="bg-yellow-100 text-yellow-700 p-2 mb-2 rounded-md text-xs">
          ⚠️ Este local ya tiene datos. Podés editarlos y guardar nuevamente.
        </div>
      )}
        <div className="w-6 h-6 rounded-full flex justify-center items-center text-custom bg-white">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>

      <table className="w-full border text-xs mt-2">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Protección contra robo</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, opciones }) => (
            <tr className="border" key={id}>
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              <td className="border p-2">
                <Select
                  label=""
                  value={opcionesSeleccionadas[id]?.id?.toString() || ""}
                  onChange={(e) => handleOpcionChange(e.target.value, opciones, id)}
                  options={opciones.map((option) => ({
                    value: option.id,
                    label: `${option.prefijo} - ${option.name}`,
                  }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
            ? "Actualizar Información"
            : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
