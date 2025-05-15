import FormReutilizable from "./FormReutilizable";

export default function EstablecimientosPrivados() {
  /* const handleSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    // Aquí puedes enviar los datos a tu servidor o realizar otras acciones
  }; */

  return (
    <div className="mx-10 mt-2 border rounded-2xl p-4">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black">
          <p>B</p>
        </div>
        <div className="flex p-2 justify-center items-center text-sm">
          <p>
            ESTABLECIMIENTOS EN EDIFICIO NO ESCOLAR O ESCOLAR CEDIDO AL SECTOR
            PRIVADO
          </p>
        </div>
      </div>
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>
            Si se trata de un establecimiento que funciona en un edificio no
            escolar o en un edificio escolar cedido por el sector privado,
            deberán relevarse exclusivamente los ítems C, D Y 6 (en caso que el
            establecimiento utilice áreas exteriores)
          </p>
        </div>
      </div>
        <FormReutilizable question={""} />
    </div>
  );
}
