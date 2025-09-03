export default function SistemaContraRoboSkeleton() {
  return (
    <div className="h-full bg-white text-black text-sm mt-10 animate-pulse">
      <div className="mx-10 mt-4">
        {/* Encabezado */}
        <div className="flex items-center gap-2 mt-2 p-2 border bg-gray-400 text-white">
          <div className="w-6 h-6 rounded-full flex justify-center items-center bg-gray-300"></div>
          <div className="h-6 flex items-center justify-center w-1/3 bg-gray-300 rounded"></div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 mt-4">
          <table className="min-w-full text-sm text-left bg-white">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-300"></th>
                <th className="border p-2 bg-gray-300"></th>
                <th className="border p-2 bg-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">
                    <div className="h-4 w-8 bg-gray-300 rounded"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton botón guardar */}
        <div className="flex justify-end mt-6">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
