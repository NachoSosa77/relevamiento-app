// EstablecimientosSkeleton.tsx
"use client";

export default function EstablecimientosSkeleton() {
  return (
    <div className="mx-10 mt-4 animate-pulse space-y-4">
      {/* Card principal */}
      <div className="flex p-2 border items-center rounded-lg bg-gray-200 text-black gap-4">
        <div className="w-6 h-6 rounded-full bg-gray-400"></div>
        <div className="h-4 w-64 bg-gray-400 rounded"></div>
      </div>

      {/* Instrucciones */}
      <div className="flex p-2 bg-gray-100 border rounded-lg">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg bg-gray-100">
        <div className="h-6 w-full bg-gray-300 rounded-t"></div>
        <div className="space-y-2 p-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-4 w-full bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 mt-2">
        <div className="h-8 w-40 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-56 bg-gray-300 rounded-full"></div>
      </div>

      {/* Modal Skeleton */}
      <div className="mt-4 border rounded-lg p-4 bg-gray-100">
        <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
        <div className="h-8 w-full bg-gray-300 rounded mb-2"></div>
        <div className="flex justify-center space-x-4 mt-4">
          <div className="h-8 w-32 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
