// file: app/components/skeletons/EquipamientoCantidadSkeleton.tsx
"use client";

export default function EquipamientoCantidadSkeleton() {
  const filas = Array.from({ length: 5 }); // cantidad de filas de ejemplo

  return (
    <div className="mx-10 text-sm animate-pulse">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-gray-300 rounded">
        <div className="w-6 h-6 rounded-full bg-gray-400"></div>
        <div className="h-6 flex-1 bg-gray-400 rounded"></div>
      </div>

      <table className="w-full border text-xs mt-2">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-300"></th>
            <th className="border p-2 bg-gray-300"></th>
            <th className="border p-2 bg-gray-300"></th>
            <th className="border p-2 bg-gray-300"></th>
            <th className="border p-2 bg-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {filas.map((_, i) => (
            <tr key={i} className="border">
              <td className="border p-2 bg-gray-200 h-6"></td>
              <td className="border p-2 bg-gray-200 h-6"></td>
              <td className="border p-2 bg-gray-200 h-6"></td>
              <td className="border p-2 bg-gray-200 h-6"></td>
              <td className="border p-2 bg-gray-200 h-6"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="bg-gray-400 w-40 h-8 rounded"></div>
      </div>
    </div>
  );
}
