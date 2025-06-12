"use client";

const CuiComponentPrint = () => {
  return (
    <div className="mx-10 text-black flex">
      <p className="text-sm font-semibold">
        CUI (Código Único de Infraestructura)
      </p>
      <div className="mt-2 p-4 border rounded-2xl shadow-lg bg-white">
        <p className="mb-2 font-bold">Ingresa el número de CUI:</p>
        <div className="border-b border-dashed h-6 w-60"></div>
      </div>
      <div className="flex p-1 bg-gray-100 border rounded-lg mt-2">
        <p className="text-xs text-gray-400">
          Ingrese el número de CUI de la institución a relevar.
        </p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-bold">Institución:</p>
        <div className="border-b border-dashed h-6 w-full"></div>
      </div>
    </div>
  );
};

export default CuiComponentPrint;
