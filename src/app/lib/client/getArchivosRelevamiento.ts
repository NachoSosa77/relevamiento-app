export const getArchivosRelevamiento = async (relevamientoId: number) => {
  const res = await fetch(`/api/relevamientos/id/${relevamientoId}/archivos`);
  const data = await res.json();
  return data;
};
