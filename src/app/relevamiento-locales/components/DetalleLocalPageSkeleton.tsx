export default function DetalleLocalPageSkeleton() {
  return (
    <div className="h-full bg-white text-black text-sm mt-32 animate-pulse">
      <div className="mx-10 mt-10">
        <div className="flex justify-start mt-10">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
        </div>

        <div className="flex justify-center mt-4 mb-4">
          <div className="h-6 w-80 bg-gray-300 rounded"></div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-left bg-white">
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr className="border-b" key={i}>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </th>
                  <td className="px-4 py-2">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton para campo "Aula común" */}
        <div className="mt-4 mx-10">
          <div className="flex items-center justify-center gap-4 border p-3 rounded">
            <div className="h-4 w-60 bg-gray-300 rounded"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-8 w-40 bg-gray-300 rounded ml-auto"></div>
          </div>
        </div>

        {/* Skeleton para componentes reutilizables */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mt-6 mx-10 border rounded p-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-4 w-full bg-gray-200 rounded mb-1"></div>
            ))}
          </div>
        ))}

        {/* Skeleton Observaciones */}
        <div className="mt-6 mx-10 border rounded p-4">
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
          <div className="h-24 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton botón guardar */}
        <div className="flex justify-center mt-6">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
