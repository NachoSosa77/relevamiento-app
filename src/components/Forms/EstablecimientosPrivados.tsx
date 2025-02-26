import FormReutilizable from "./FormReutilizable";

export default function EstablecimientosPrivados() {
  /* const handleSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    // Aquí puedes enviar los datos a tu servidor o realizar otras acciones
  }; */

  return (
    <div className="mx-10">
      <div className="flex mt-2 p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
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
          <p>Si se trata de un establecimiento que funciona en un edificio no escolar o en un edificio escolar cedido por el sector privado, deberán relevarse exclusivamente los ítems C, D Y 6 (en caso que el establecimiento utilice áreas exteriores)</p>
        </div>
      </div>
      <div className="flex p-2 justify-center text-sm gap-2">
        <FormReutilizable question={""} />
      </div>
    </div>
  );
}
