// PlanoSkeleton.tsx
"use client";

export default function PlanoSkeleton() {
  return (
    <div className="mx-8 my-6 space-y-6 animate-pulse">
      {/* Intro */}
      <div className="bg-gray-200 h-10 rounded-2xl border shadow-sm w-full"></div>

      {/* Banner editando */}
      <div className="bg-yellow-200 h-6 rounded text-sm w-1/2"></div>

      {/* Paso 1 */}
      <div className="bg-gray-200 p-4 rounded-2xl border shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          <div className="h-4 w-64 bg-gray-400 rounded"></div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-16 h-8 bg-gray-400 rounded"></div>
          <div className="w-16 h-8 bg-gray-400 rounded"></div>
        </div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>

      {/* Aclaraciones */}
      <div className="bg-gray-100 p-4 rounded-2xl border shadow-sm space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
      </div>

      {/* Paso 2 y 3 */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-gray-200 p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
            <div className="h-4 w-48 bg-gray-400 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>

        <div className="bg-gray-200 p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
            <div className="h-4 w-48 bg-gray-400 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Paso 3 si "NO" */}
      <div className="bg-gray-200 p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          <div className="h-4 w-48 bg-gray-400 rounded"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
