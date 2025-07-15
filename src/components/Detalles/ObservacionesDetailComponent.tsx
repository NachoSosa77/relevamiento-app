interface Props {
  observaciones: string;
}

export default function ObservacionesDetailComponent({ observaciones }: Props) {

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Observaciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          <tr>
            <td className="px-4 py-2 text-left truncate max-w-xs">
              {observaciones || "No hay observaciones registradas."}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
