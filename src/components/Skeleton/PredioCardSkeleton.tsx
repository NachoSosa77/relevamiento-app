export default function PredioCardSkeleton() {
  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full animate-pulse">
        {/* Banner (cuando esté editando) */}
        <div className="h-8 bg-yellow-50 rounded border border-yellow-100" />

        {/* Header con número y título */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>

        {/* Card interna del form */}
        <div className="space-y-4 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
          {/* Pregunta 1.1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="h-4 w-[320px] bg-gray-200 rounded" />
            </div>

            <div className="flex flex-wrap items-center gap-4 ml-14">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              {/* Select */}
              <div className="h-10 w-64 bg-gray-200 rounded" />
              {/* Input opcional otra situación */}
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-10 w-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Pregunta 1.2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="h-4 w-[360px] bg-gray-200 rounded" />
            </div>

            <div className="flex flex-wrap items-center gap-6 ml-14">
              {/* Tres checkboxes fake */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-6 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-6 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-6 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-end pt-4">
            <div className="h-9 w-40 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
