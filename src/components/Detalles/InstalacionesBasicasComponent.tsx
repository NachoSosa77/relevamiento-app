import { useInstalacionesBasicas } from "@/app/home/relevamiento/config/useData";

export default function InstalacionesBasicasComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: condiciones, loading } = useInstalacionesBasicas(localId, relevamientoId);

  const datosFiltrados = condiciones.filter(
  (item) => item.tipo_instalacion?.toLowerCase() !== "no"
);

  if (loading)
    return <div className="text-sm text-gray-500">Cargando instalaciones básicas...</div>;

  if (condiciones.length === 0) return <div>No hay información cargada.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Instalación
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Tipo de instalación
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              ¿Funciona?
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Motivo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {datosFiltrados.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.servicio}
              </td>
              <td className="px-4 py-2 text-left">{item.tipo_instalacion}</td>
              <td className="px-4 py-2 text-left">{item.funciona}</td>
              <td className="px-4 py-2 text-left">{item.motivo || "-"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
