import { useMaterialesPredominantes } from "@/app/home/relevamiento/config/useData";
import clsx from "clsx";

export default function MaterialesComponent({
  localId,
  relevamientoId,
}: {
  localId: number | undefined;
  relevamientoId: number | undefined;
}) {
  const { data: materiales, loading } = useMaterialesPredominantes(
    localId,
    relevamientoId
  );

  if (loading)
    return <div className="text-sm text-gray-500">Cargando materiales...</div>;

  if (materiales.length === 0)
    return <div>No hay materiales predominantes cargados.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Terminaciones
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Material
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {materiales.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-left truncate max-w-xs">
                {item.item}
              </td>
              <td className="px-4 py-2 text-left">{item.material}</td>
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
