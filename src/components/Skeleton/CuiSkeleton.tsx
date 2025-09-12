// CuiSkeleton.tsx
"use client";

export default function CuiSkeleton() {
  return (
    <div className="mx-10 animate-pulse">
      {/* Card principal */}
      <div className="flex mt-2 p-2 border items-center rounded-2xl shadow-lg bg-white gap-4">
        {/* Icono */}
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        {/* Label */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded mt-1"></div>
        </div>
        {/* Input numérico */}
        <div className="w-20 h-8 bg-gray-300 rounded ml-auto"></div>
      </div>
      {/* Sublabel */}
      <div className="flex p-1 bg-gray-100 border rounded-lg mt-2">
        <div className="h-3 w-48 bg-gray-300 rounded"></div>
      </div>
      {/* Select */}
      <div className="mt-2 p-2 bg-gray-200 rounded-lg h-8 w-full"></div>
    </div>
  );
}
