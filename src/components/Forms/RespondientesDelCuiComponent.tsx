import { respondientesHeader } from "@/app/relevamiento-predio/config/respondientesHeader";
import Table from "../Table/TableReutilizable";

export default function RespondientesDelCuiComponent() {
  /* const handleSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    // Aquí puedes enviar los datos a tu servidor o realizar otras acciones
  }; */

  return (
    <div className="mx-10">
      <div className="flex mt-2 border items-center justify-between bg-black">
        <div className="flex p-2 justify-center items-center text-white text-sm">
          <p>RESPONDIENTES DEL CUI</p>
        </div>               
      </div>
      <div className="flex p-2 justify-center items-cente text-sm">
      <Table columns={respondientesHeader} addRowButtonText="Añadir Responsable" onSubmit={() => console.log('Datos enviados')} addButtonText={"Cargar Responsables"}/>
      </div>
    </div>
  );
}
