// components/ServiciosBasicos/skeletons/ServiciosBasicosSkeleton.tsx
"use client";

export default function ServiciosBasicosSkeleton() {
  const filas = Array.from({ length: 4 }, (_, i) => i + 1);

  return (
    <div className="mx-10 text-sm animate-pulse">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-gray-300 text-gray-500">
        <div className="w-6 h-6 rounded-full bg-gray-400" />
        <div className="h-6 flex-1 bg-gray-400 rounded" />
      </div>

      <table className="w-full border text-xs mt-2">
        <thead>
          <tr className="bg-gray-300 text-gray-500">
            <th className="border p-2">#</th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Funciona</th>
            <th className="border p-2">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f} className="border">
              <td className="border p-2 bg-gray-200 h-6" />
              <td className="border p-2 bg-gray-200 h-6" />
              <td className="border p-2 bg-gray-200 h-6" />
              <td className="border p-2 bg-gray-200 h-6" />
              <td className="border p-2 bg-gray-200 h-6" />
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="bg-gray-400 w-36 h-8 rounded-md" />
      </div>
    </div>
  );
}
