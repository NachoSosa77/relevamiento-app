// ObservacionesSkeleton.tsx
"use client";

export default function ObservacionesSkeleton() {
  return (
    <div className="mx-10 my-6 border rounded-2xl shadow-lg animate-pulse">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        {/* Título */}
        <div className="h-5 w-40 bg-gray-300 rounded"></div>
        {/* Textarea */}
        <div className="h-32 bg-gray-300 rounded"></div>
        {/* Botón */}
        <div className="flex justify-end mt-2">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
