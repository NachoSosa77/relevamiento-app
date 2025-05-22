import { useCondicionesTermicas } from "@/app/home/relevamiento/config/useData";

export default function AcondicionamientoTermicoComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: condiciones, loading } = useCondicionesTermicas(localId, relevamientoId);

  if (loading)
    return <div className="text-sm text-gray-500">Cargando acondicionamiento térmico...</div>;

  if (condiciones.length === 0) return <div>No hay información cargada.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Condición
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Tipo
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Cantidad
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Disponibilidad
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {condiciones.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.temperatura}
              </td>
              <td className="px-4 py-2 text-left">{item.tipo}</td>
              <td className="px-4 py-2 text-left">{item.cantidad}</td>
              <td className="px-4 py-2 text-left">{item.disponibilidad}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
