import FormReutilizable from "./FormReutilizable";

export default function EstablecimientosPrivados() {
  return (
    <div className="mx-10 mt-2 border rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black text-sm font-bold">
          B
        </div>
        <p className="text-sm font-medium text-gray-800">
          ESTABLECIMIENTOS EN EDIFICIO NO ESCOLAR O ESCOLAR CEDIDO AL SECTOR PRIVADO
        </p>
      </div>

      <div className="bg-black rounded-md p-4 mb-6">
        <p className="text-white text-sm leading-relaxed">
          Si se trata de un establecimiento que funciona en un edificio no escolar o en un edificio escolar cedido por el sector privado,
          deberán relevarse exclusivamente los ítems C, D y 6 (en caso que el establecimiento utilice áreas exteriores)
        </p>
      </div>

      <FormReutilizable />
    </div>
  );
}
