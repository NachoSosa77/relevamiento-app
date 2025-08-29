"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { Dimension } from "@/interfaces/DimensionLocales";
import { localesService } from "@/services/localesServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type DimensionesProps = {
  localId: number;
  onUpdate?: () => void;
};

export default function Dimensiones({ localId, onUpdate }: DimensionesProps) {
  const [dimensiones, setDimensiones] = useState<Dimension>({
    id: localId,
    largo_predominante: 0,
    ancho_predominante: 0,
    diametro: 0,
    altura_maxima: 0,
    altura_minima: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar dimensiones iniciales
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await localesService.getDimensionesById(localId);
        if (isMounted && data) {
          setDimensiones(data);
        }
      } catch (err: unknown) {
        console.error("Error al cargar dimensiones:", err);
        const message = err instanceof Error ? err.message : String(err);
        toast.error("Error al cargar dimensiones: " + message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [localId]);

  const handleInputChange = (
    field: keyof Omit<Dimension, "id">,
    value: number
  ) => {
    setDimensiones((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    const {...payload } = dimensiones;

    const hayDatos = Object.values(payload).some(
      (v) => v !== null && v !== undefined && v !== 0
    );

    if (!hayDatos) {
      toast.warning("Por favor, completá al menos un dato antes de guardar.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await localesService.updateDimensionesById(localId, payload);
      toast.success("Dimensiones actualizadas correctamente.");
      onUpdate?.();
    } catch (err: unknown) {
      console.error("Error al guardar dimensiones:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message ?? "Ocurrió un error al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Cargando dimensiones...</p>;

  return (
    <div className="mx-10 text-sm">
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2 bg-white text-custom">#</th>
            <th className="border p-2">DIMENSIONES</th>
            <th className="border p-2">Largo predominante (m)</th>
            <th className="border p-2">Ancho predominante (m)</th>
            <th className="border p-2">Diámetro (m)</th>
            <th className="border p-2">Altura máxima (m)</th>
            <th className="border p-2">Altura mínima (m)</th>
            <th className="border p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border" key={dimensiones.id}>
            <td className="border p-2">1</td>
            <td className="border p-2"></td>
            <td className="border p-2">
              <DecimalNumericInput
                value={dimensiones.largo_predominante ?? 0}
                onChange={(v) =>
                  handleInputChange("largo_predominante", Number(v))
                }
              />
            </td>
            <td className="border p-2">
              <DecimalNumericInput
                value={dimensiones.ancho_predominante ?? 0}
                onChange={(v) =>
                  handleInputChange("ancho_predominante", Number(v))
                }
              />
            </td>
            <td className="border p-2">
              <DecimalNumericInput
                value={dimensiones.diametro ?? 0}
                onChange={(v) => handleInputChange("diametro", Number(v))}
              />
            </td>
            <td className="border p-2">
              <DecimalNumericInput
                value={dimensiones.altura_maxima ?? 0}
                onChange={(v) => handleInputChange("altura_maxima", Number(v))}
              />
            </td>
            <td className="border p-2">
              <DecimalNumericInput
                value={dimensiones.altura_minima ?? 0}
                onChange={(v) => handleInputChange("altura_minima", Number(v))}
              />
            </td>
            <td className="border p-2">
              <button
                onClick={handleGuardar}
                disabled={isSubmitting}
                className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
