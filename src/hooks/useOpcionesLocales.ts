// hooks/useOpcionesLocales.ts
import { useEffect, useState } from "react";

export interface OpcionLocal {
  id: number;
  name: string;
  tipo: string;
}

export const useOpcionesLocales = () => {
  const [opciones, setOpciones] = useState<OpcionLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const res = await fetch("/api/locales_por_construccion/opciones"); // ruta de tu endpoint
        if (!res.ok) throw new Error("Error al traer opciones");
        const json: OpcionLocal[] = await res.json();
        setOpciones(json);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpciones();
  }, []);

  return { opciones, loading, error };
};
