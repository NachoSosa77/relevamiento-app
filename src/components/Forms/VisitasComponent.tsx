import { visitasHeader } from "@/app/relevamiento-predio/config/visitasHeader";
import Table from "../Table/TableReutilizable";

export default function VisitasComponent() {
  /* const handleSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    // Aquí puedes enviar los datos a tu servidor o realizar otras acciones
  }; */

  return (
    <div className="mx-10">
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>VISITAS REALIZADAS PARA COMPLETAR EL CENSO</p>
        </div>               
      </div>
      <div className="flex p-2 justify-center items-cente text-sm">
      <Table columns={visitasHeader} addRowButtonText="Añadir nueva visita" onSubmit={() => console.log('Datos enviados')} addButtonText={"Cargar visitas"}/>
      </div>
    </div>
  );
}
