export const getConstruccioneslocalesRelevamiento = async (
  relevamientoId: number
) => {
  const res = await fetch(`/api/relevamientos/id/${relevamientoId}/locales`);
  const data = await res.json();
  return data;
};
