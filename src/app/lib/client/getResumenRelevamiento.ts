export const getResumenRelevamiento = async (relevamientoId: number) => {
  const res = await fetch(`/api/relevamientos/id/${relevamientoId}/resumen`);
  const data = await res.json();
  return data;
};
