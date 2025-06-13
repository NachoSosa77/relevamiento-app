/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

export const useInstitucionesByCui = () => {
  const selectedCui = useAppSelector((state) => state.espacio_escolar.cui);
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCui) {
      setInstituciones([]);
      return;
    }

    const fetchInstituciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/instituciones/por-cui/${selectedCui}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setInstituciones([]);
            setError("No se encontraron instituciones");
            return;
          }
          throw new Error("Error al obtener las instituciones");
        }
        const data = await response.json();
        setInstituciones(data.instituciones || []);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituciones();
  }, [selectedCui]);

  return { instituciones, loading, error, setInstituciones };
};
