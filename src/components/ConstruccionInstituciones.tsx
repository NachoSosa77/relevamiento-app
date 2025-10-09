/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface ConstruccionInstitucionesProps {
  relevamientoId: number | undefined;
  construccionId: number | undefined;
}

interface Institucion {
  id?: number;
  institucion: string;
  localidad: string;
  modalidad_nivel: string;
  cue: number;
  cui: number;
}

const ConstruccionInstituciones: React.FC<ConstruccionInstitucionesProps> = ({
  relevamientoId,
  construccionId,
}) => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [selectedInstituciones, setSelectedInstituciones] = useState<number[]>([]);
  const [initialSelected, setInitialSelected] = useState<number[]>([]); // ← DB snapshot
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbHasData, setDbHasData] = useState(false);

  const fetchAsociadas = useCallback(async () => {
    if (!construccionId || !relevamientoId) return;
    try {
      const res = await fetch(
        `/api/instituciones_por_construccion?construccion_id=${construccionId}&relevamiento_id=${relevamientoId}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { institucion_id: number }[] = await res.json();
      const ids = (data || []).map((d) => d.institucion_id);
      setSelectedInstituciones(ids);
      setInitialSelected(ids);         // ← guardamos estado original
      setDbHasData(ids.length > 0);
    } catch (_e) {
      toast.error("No se pudieron cargar las instituciones asociadas");
    }
  }, [construccionId, relevamientoId]);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      if (!relevamientoId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/instituciones_por_relevamiento/${relevamientoId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Institucion[] = await res.json();
        if (cancelled) return;

        setInstituciones(data || []);
        await fetchAsociadas();
      } catch (_e) {
        if (!cancelled) toast.error("No se pudieron cargar las instituciones");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, [relevamientoId, fetchAsociadas]);

  const toggleInstitucion = (id: number) => {
    if (isSubmitting) return;
    setSelectedInstituciones((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Dif de lo que se va a borrar vs DB
  const removals = initialSelected.filter(id => !selectedInstituciones.includes(id));
  const additions = selectedInstituciones.filter(id => !initialSelected.includes(id));

  const handleDeshacer = () => {
    if (isSubmitting) return;
    setSelectedInstituciones(initialSelected); // ← volvemos a lo que hay en DB
  };

  const handleGuardar = async () => {
    if (isSubmitting) return;
    if (!construccionId || !relevamientoId) {
      toast.error("Faltan datos para guardar (construcción o relevamiento)");
      return;
    }

    // Si hay eliminaciones, pedimos confirmación
    if (removals.length > 0) {
      const confirmar = window.confirm(
        `Vas a quitar ${removals.length} institución(es) asociada(s). ¿Querés continuar?`
      );
      if (!confirmar) return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/instituciones_por_construccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relevamiento_id: relevamientoId,
          construccion_id: construccionId,
          instituciones: selectedInstituciones, // lista final
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Instituciones asociadas correctamente");

      // Refrescar desde DB para dejar todo consistente y encender banner
      await fetchAsociadas();
      setDbHasData(true);
    } catch (_e) {
      toast.error("Error guardando asociaciones");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titulo = useMemo(
    () => "CUE-ANEXOS USUARIOS DE LA CONSTRUCCIÓN",
    []
  );

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>B</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">{titulo}</p>
        </div>
        <div className="flex items-center p-1 border bg-gray-100 text-gray-400 text-xs">
          <p>
            Transcriba del Formulario 1 la denominación de los establecimientos educativos
            que funcionan en la construcción y el Número de CUE-Anexo de cada uno de ellos.
          </p>
        </div>
      </div>

      {/* Banner edición / aviso de eliminaciones */}
      {!loading && dbHasData && (
        <div className="bg-yellow-100 text-yellow-800 p-2 my-3 rounded-2xl">
          Estás editando asociaciones ya existentes.
          {removals.length > 0 && (
            <span className="ml-2">
              Deseleccionaste <b>{removals.length}</b> institución(es) que se eliminarán al guardar.
            </span>
          )}
        </div>
      )}

      {/* Acciones para cambios locales */}
      {!loading && (removals.length > 0 || additions.length > 0) && (
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={handleDeshacer}
            disabled={isSubmitting}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded"
          >
            Deshacer cambios
          </button>
        </div>
      )}

      {/* Listado */}
      {loading ? (
        <p className="mt-3 text-gray-500">Cargando instituciones…</p>
      ) : instituciones.length === 0 ? (
        <p className="mt-3">No hay instituciones para este relevamiento.</p>
      ) : (
        <ul className="flex flex-col items-center justify-start max-h-60 overflow-y-auto mt-3 gap-2">
          {instituciones.map((inst) => (
            <li key={inst.id}>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedInstituciones.includes(inst.id!)}
                  onChange={() => toggleInstitucion(inst.id!)}
                  disabled={isSubmitting}
                />
                <span>{inst.institucion}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {/* Guardar */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting || loading || !construccionId || !relevamientoId}
          className="text-sm text-white font-bold bg-custom hover:bg-custom/50 disabled:opacity-60 p-2 rounded-lg"
        >
          {isSubmitting
            ? "Guardando..."
            : dbHasData
            ? "Actualizar asociaciones"
            : "Guardar asociaciones"}
        </button>
      </div>
    </div>
  );
};

export default ConstruccionInstituciones;
