import { useIluminacionVentilacion } from "@/app/home/relevamiento/config/useData";

export default function IluVentilacionComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: condiciones, loading } = useIluminacionVentilacion(
    localId,
    relevamientoId
  );

  if (loading)
    return <div className="text-sm text-gray-500">Cargando condiciones...</div>;

  if (condiciones.length === 0) return <div>No hay condiciones cargadas.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Condición
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Disponibilidad
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Superficie de iluminación
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Superfice de ventilación
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {condiciones.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.condicion}
              </td>
              <td className="px-4 py-2 text-left">{item.disponibilidad}</td>
              <td className="px-4 py-2 text-left">
                {item.superficie_iluminacion}
              </td>
              <td className="px-4 py-2 text-left">
                {item.superficie_ventilacion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
