"use client";

export default function IluminacionVentilacionSkeleton() {
  return (
    <div className="h-full bg-white text-black text-sm mt-10 animate-pulse">
      <div className="mx-10 mt-4">
        {/* Header */}
        <div className="flex items-center gap-2 mt-2 p-2 border bg-custom text-white">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="h-6 flex-1 bg-gray-300 rounded"></div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 mt-4">
          <table className="min-w-full text-sm text-left bg-white">
            <thead>
              <tr className="bg-gray-200 text-white">
                <th className="border p-2 bg-gray-300"></th>
                <th className="border p-2 bg-gray-300"></th>
                <th className="border p-2 bg-gray-300"></th>
                <th className="border p-2 bg-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr className="border-b" key={i}>
                  <td className="border p-2">
                    <div className="h-4 w-6 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border p-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border p-2">
                    <div className="h-4 w-12 bg-gray-200 rounded mx-auto"></div>
                  </td>
                  <td className="border p-2">
                    <div className="h-4 w-12 bg-gray-200 rounded mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end mt-4">
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
