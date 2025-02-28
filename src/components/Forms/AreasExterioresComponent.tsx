import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { areasExterioresService } from "@/services/areasExterioresService";
import { ChangeEvent, useEffect, useState } from "react";
import ReusableTable from "../Table/TableReutilizable";
import AlphanumericInput from "../ui/AlphanumericInput";
import Select from "../ui/SelectComponent";

interface FormData {
  identificacion_plano: string;
  tipo: string;
  superficie: string;
}

export default function AreasExterioresComponent() {
  const [selectArea, setSelectArea] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    identificacion_plano: "",
    tipo: "null",
    superficie: "",
  });
  const [tableData, setTableData] = useState<FormData[]>([]); // Datos para la tabla
  const [opcionesAreas, setOpcionesAreas] = useState<TipoAreasExteriores[]>([]); // Ajusta el tipo según la estructura de tus datos
  //console.log(areasExteriores, "locales");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await areasExterioresService.getOpcionesAreasExteriores();
        setOpcionesAreas(data);
      } catch (error) {
        console.error('Error al obtener opciones de áreas exteriores:', error);
      }
    }
    fetchData();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectArea(Number(selectedType));
    setFormData({ ...formData, tipo: selectedType }); // Actualiza el formData
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [name]: event.target.value });
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Crea un objeto con los datos que necesitas enviar
      const areasExterioresData = {
        identificacion_plano: formData.identificacion_plano,
        tipo: formData.tipo,
        superficie: formData.superficie,
      };
  
      // Envía los datos al backend
      const response = await areasExterioresService.postAreasExteriores(areasExterioresData);
      console.log('Respuesta del backend:', response);
  
      // Agrega los datos a la tabla si la respuesta es exitosa
      setTableData([...tableData, formData]);
  
      // Limpia el formulario con los campos correctos
      setFormData({ identificacion_plano: '', tipo: "", superficie: '' });
      setSelectArea(null);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      // Maneja el error (muestra un mensaje al usuario, etc.)
    }    
  };

  const columns = [
    // Definición de las columnas para la tabla
    { Header: "Identificación", accessor: "identificacion_plano" },
    {
      Header: "Tipo",
      accessor: "tipo",
      Cell: ({ value }: { value: number }) => {
        const opcion = opcionesAreas.find((op) => op.id === Number(value));
        return opcion ? opcion.name : "No definido";}
    }, // Muestra el nombre del tipo
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
                value={formData.identificacion_plano}
                onChange={(event) => handleInputChange("identificacion_plano", event)}
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
                options={opcionesAreas.map((opcion) => ({
                  value: opcion.id,
                  label: opcion.name,
                }))}
                onChange={handleSelectChange}
              />             
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
