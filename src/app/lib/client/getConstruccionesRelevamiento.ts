export const getConstruccionesRelevamiento = async (relevamientoId: number) => {
  const res = await fetch(
    `/api/relevamientos/id/${relevamientoId}/construcciones`
  );
  const data = await res.json();
  return data;
};
