"use client";



export default function ObservacionesComponent() {
  
  

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">OBSERVACIONES</p>
        </div>
      </div>
      <textarea className="w-full h-32 mt-2 p-2 border resize-none" />
      <div className="flex justify-end mt-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400">
          Guardar
        </button>
      </div>
    </div>
  );
}
