export default function TableCantidadSkeleton({ filas = 3 }: { filas?: number }) {
  return (
    <div className="mx-10 text-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2 mt-2 p-2 border bg-gray-300 text-gray-400">
        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
      </div>

      {/* Tabla */}
      <table className="w-full border text-xs mt-2">
        <thead>
          <tr className="bg-gray-300 text-gray-400">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {Array(filas)
            .fill(0)
            .map((_, rowIndex) => (
              <tr className="border" key={rowIndex}>
                {Array(5)
                  .fill(0)
                  .map((_, colIndex) => (
                    <td key={colIndex} className="border p-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Botón */}
      <div className="flex justify-end mt-4">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
