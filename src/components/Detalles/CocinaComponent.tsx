import { useEquipamientoCocinaOficce } from "@/app/home/relevamiento/config/useData";

export default function CocinaComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: equipamientos, loading } = useEquipamientoCocinaOficce(
    localId,
    relevamientoId
  );

  if (loading)
    return <div className="text-sm text-gray-500">Cargando información...</div>;

  if (equipamientos.length === 0)
    return <div>No hay información relevada.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Equipamiento
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Cantidad
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              En funcionamiento
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {equipamientos.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.equipamiento}
              </td>
              <td className="px-4 py-2 text-left">{item.cantidad}</td>
              <td className="px-4 py-2 text-left">
                {item.cantidad_funcionamiento}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
