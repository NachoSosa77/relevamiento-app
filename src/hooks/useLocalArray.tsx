import { useCallback, useEffect, useState } from "react";

export function useLocalArray<Item>(
  localId: number,
  relevamientoId: number,
  endpoint: string
) {
  const [data, setData] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `/api/locales_por_construccion/${localId}/${endpoint}?relevamientoId=${relevamientoId}`
      );
      if (!res.ok) throw new Error("Error al cargar los datos");
      const json = await res.json();
      setData(json || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }, [localId, relevamientoId, endpoint]); // 👈 dependencias estables

  const updateData = async (payload: Partial<Item> & { id: number }) => {
    try {
      setIsSaving(true);
      const res = await fetch(
        `/api/locales_por_construccion/${payload.id}/${endpoint}?relevamientoId=${relevamientoId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Error al guardar");
      await fetchData(); // ahora fetchData es estable
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ sin warning

  return { data, loading, error, isSaving, updateData };
}
