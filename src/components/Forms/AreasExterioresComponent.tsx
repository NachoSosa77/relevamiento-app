import { AreasExteriores } from "@/app/lib/AreasExteriores";
import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { ChangeEvent, useState } from "react";
import ReusableTable from "../Table/TableReutilizable";
import AlphanumericInput from "../ui/AlphanumericInput";
import Select from "../ui/SelectComponent";

interface FormData {
  identificacion: string;
  tipo: number | null;
  superficie: string;
}

export default function AreasExterioresComponent() {
    const [selectArea, setSelectArea] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>({
      identificacion: "",
      tipo: null,
      superficie: "",
    });
    const [tableData, setTableData] = useState<FormData[]>([]); // Datos para la tabla
    const areasExteriores: TipoAreasExteriores[] = AreasExteriores;
    const [otroTipo, setOtroTipo] = useState(""); // Nuevo estado para el campo "Otro Tipo"

    console.log(areasExteriores, "locales");

    const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedType = Number(event.target.value);
      setSelectArea(selectedType);
      setFormData({ ...formData, tipo: selectedType }); // Actualiza el formData
    };

    const handleInputChange = (name: keyof FormData, event: ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [name]: event.target.value });
    };

    const handleOtroTipoChange = (event: ChangeEvent<HTMLInputElement>) => {
      setOtroTipo(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      setTableData([...tableData, formData]); // Agrega los datos a la tabla
      setFormData({ identificacion: "", tipo: null, superficie: "" }); // Limpia el formulario
      setSelectArea(null); // Resetea el select
      setOtroTipo(""); // Limpia el campo "Otro Tipo"
      console.log("Datos a enviar:", formData); // Aquí puedes enviar los datos al backend
    };

    const columns = [ // Definición de las columnas para la tabla
      { Header: "Identificación", accessor: "identificacion" },
      { Header: "Tipo", accessor: "tipo", Cell: ({ value }) => areasExteriores.find(area => area.id === value)?.name || "-" }, // Muestra el nombre del tipo
      { Header: "Superficie", accessor: "superficie" },
    ];

  return (
    <div className="mx-10 bg-white text-black">
      <div className="flex mt-2 p-4 border items-center justify-between">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black text-xl">
          <p>4</p>
        </div>
        <div className="justify-center">
          <p className="text-lg font-bold ml-4">ÁREAS EXTERIORES</p>
        </div>
        <div className="flex flex-col p-2 text-xs text-gray-400 bg-gray-100 border justify-end">
          <p className="font-semibold text-center">Tipo de áreas exteriores</p>
          <p>
            A-Patio B-Área de juegos de Nivel Inicial C-Expansión D-Playón
            Deportivo
          </p>
          <p>E-Anfiteatro F-Plaza seca G-Pileta H-Canchas Deportivas</p>
          <p>I-Huerta J-Corral K-Estacionamiento L-Áreas libres M-Otra</p>
        </div>
        {/* <div className="ml-auto">
                <AlphanumericInput
                    subLabel=""
                    label={""}
                    value={""}
                    onChange={() => set""()}
                />
                </div> */}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Identificación en el plano
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="E"
                label={""}
                value={formData.identificacion}
                onChange={(event) => handleInputChange("identificacion", event)}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Tipo
            </p>
            <div className="mt-2 w-full">
            <Select
                label={""}
                value={selectArea?.toString() || ""}
                options={areasExteriores.map((local)=>({
                  value: local.id,
                  label: local.name,
                }))}                
                onChange={handleSelecteChange}
            />
            {/* Campo "Otro Tipo" condicional */}
            {/* {selectArea === 13 && ( // 13 es el ID de "M - Otra"
                  <AlphanumericInput
                    subLabel="Detalle"
                    label="Otro Tipo"
                    value={otroTipo}
                    onChange={handleOtroTipoChange}
                  />
                )} */}
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="m²"
                label={""}
                value={formData.superficie}
                onChange={(event) => handleInputChange("superficie", event)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-sm font-bold bg-gray-100 p-2 rounded-md flex-nowrap"
            >
              Cargar Información
            </button>
          </div>
        </div>
      </form>
      <ReusableTable data={tableData} columns={columns} />
    </div>
  );
}
