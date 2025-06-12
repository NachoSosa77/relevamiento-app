import { useEffect, useState } from "react";

export function useRelevamientoId() {
  const [relevamientoId, setRelevamientoId] = useState<number>();

  useEffect(() => {
    const storedId = sessionStorage.getItem("relevamientoId");
    if (storedId) {
      setRelevamientoId(Number(storedId));
    }
  }, []);

  return relevamientoId;
}
