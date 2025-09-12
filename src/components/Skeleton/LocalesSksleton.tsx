"use client";

import clsx from "clsx";

interface LocalesPorConstruccionSkeletonProps {
  cantidadConstrucciones: number;
}

export default function LocalesPorConstruccionSkeleton({
  cantidadConstrucciones,
}: LocalesPorConstruccionSkeletonProps) {
  return (
    <div className="mx-8 my-6 border rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
        <div className="h-4 w-48 bg-gray-300 animate-pulse rounded" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {Array.from({ length: cantidadConstrucciones }).map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              "h-8 rounded-t-lg px-4",
              "bg-gray-300 animate-pulse"
            )}
          />
        ))}
      </div>

      {/* Tab panel */}
      <div className="bg-white border rounded-b-lg p-4 shadow space-y-4">
        {/* Form skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-300 animate-pulse rounded"
            />
          ))}
        </div>

        {/* Botón agregar local */}
        <div className="flex justify-end mt-2">
          <div className="h-10 w-32 bg-gray-300 animate-pulse rounded" />
        </div>

        {/* Tabla de locales */}
        <div className="mt-4 border rounded-lg overflow-hidden">
          {Array.from({ length: 3 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex gap-2 px-2 py-3 border-b last:border-b-0"
            >
              {Array.from({ length: 7 }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-6 flex-1 bg-gray-300 animate-pulse rounded"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end mt-4">
          <div className="h-10 w-48 bg-gray-300 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
