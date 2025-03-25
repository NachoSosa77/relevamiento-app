import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { useAppDispatch } from "@/redux/hooks";
import { setAreaExteriorId } from "@/redux/slices/espacioEscolarSlice";
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener opciones de áreas exteriores
        const opciones =
          await areasExterioresService.getOpcionesAreasExteriores();
        setOpcionesAreas(opciones);

        // Cargar datos guardados previamente en la tabla
        const existingData = await areasExterioresService.getAreasExteriores();
        setTableData(Array.isArray(existingData) ? existingData : []);
      } catch (error) {
        console.error("Error al obtener opciones de áreas exteriores:", error);
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
      const response = await areasExterioresService.postAreasExteriores(
        areasExterioresData
      );
      console.log("Respuesta del backend:", response);
      dispatch(setAreaExteriorId(response.id)); // Asumiendo que la respuesta tiene un campo 'id'

      // Agregar al estado local
      setTableData((prev) => [...prev, response]);

      // Limpia el formulario con los campos correctos
      setFormData({ identificacion_plano: "", tipo: "", superficie: "" });
      setSelectArea(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
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
        return opcion ? opcion.name : "No definido";
      },
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
      </div>
      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Identificación en el plano</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Superficie</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                <AlphanumericInput
                  subLabel="E"
                  label={""}
                  value={formData.identificacion_plano}
                  onChange={(event) =>
                    handleInputChange("identificacion_plano", event)
                  }
                />
              </td>
              <td className="border p-2">
                <Select
                  label={""}
                  value={selectArea?.toString() || ""}
                  options={opcionesAreas.map((opcion) => ({
                    value: opcion.id,
                    label: opcion.name,
                  }))}
                  onChange={handleSelectChange}
                />
              </td>
              <td className="border p-2">
                <AlphanumericInput
                  subLabel="m²"
                  label={""}
                  value={formData.superficie}
                  onChange={(event) => handleInputChange("superficie", event)}
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  type="submit"
                  className="text-sm font-bold bg-gray-100 p-2 rounded-md flex-nowrap"
                >
                  Cargar Información
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <ReusableTable data={tableData ?? []} columns={columns} />
    </div>
  );
}
