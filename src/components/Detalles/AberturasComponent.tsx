import { useAberturas } from "@/app/home/relevamiento/config/useData";
import clsx from "clsx";

export default function AberturasComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: aberturas, loading } = useAberturas(localId, relevamientoId);

  if (loading)
    return <div className="text-sm text-gray-500">Cargando aberturas...</div>;

  if (aberturas.length === 0) return <div>No hay aberturas cargadas.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Abertura
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Tipo
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Cantidad
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {aberturas.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.abertura}
              </td>
              <td className="px-4 py-2 text-left">{item.tipo}</td>
              <td className="px-4 py-2 text-left">{item.cantidad}</td>

              <td className="px-4 py-2 text-left">
                <span
                  className={clsx("font-semibold", {
                    "text-green-600": item.estado === "Bueno",
                    "text-yellow-600": item.estado === "Regular",
                    "text-red-600": item.estado === "Malo",
                  })}
                >
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
