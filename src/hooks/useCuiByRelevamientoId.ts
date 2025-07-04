import { useEffect, useState } from "react";

export const useCuiFromRelevamientoId = (relevamientoId?: number) => {
  const [cui, setCui] = useState<number>(0); // Inicializo en 0 para evitar undefined

  useEffect(() => {
    if (!relevamientoId) return;

    const fetchCui = async () => {
      const res = await fetch(`/api/relevamientos/id/${relevamientoId}`);
      const data = await res.json();
      setCui(data?.cui_id ?? 0); // si no hay cui_id, pongo 0
      sessionStorage.setItem("cui", (data?.cui_id ?? 0).toString());
    };

    fetchCui();
  }, [relevamientoId]);

  return cui;
};
