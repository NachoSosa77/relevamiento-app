import FormReutilizable from "./FormReutilizable";

export default function EstablecimientosPrivados() {
  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
            B
          </div>
          <p className="text-sm font-semibold text-gray-700">
            ESTABLECIMIENTOS EN EDIFICIO NO ESCOLAR O ESCOLAR CEDIDO AL SECTOR
            PRIVADO
          </p>
        </div>

        <div className="bg-slate-200 rounded-md p-2">
          <p className=" text-xs leading-relaxed">
            Si se trata de un establecimiento que funciona en un edificio no
            escolar o en un edificio escolar cedido por el sector privado,
            deberán relevarse exclusivamente los ítems C, D y 6 (en caso que el
            establecimiento utilice áreas exteriores)
          </p>
        </div>

        <FormReutilizable />
      </div>
    </div>
  );
}
