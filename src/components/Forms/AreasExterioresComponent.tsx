import { AreasExteriores } from "@/interfaces/AreaExterior";
import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addAreasExteriores,
  deleteAreasExteriores,
} from "@/redux/slices/espacioEscolarSlice";
import { areasExterioresService } from "@/services/areasExterioresService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import AlphanumericInput from "../ui/AlphanumericInput";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import Select from "../ui/SelectComponent";

interface FormData {
  identificacion_plano: number;
  tipo: string;
  superficie: number;
}

export default function AreasExterioresComponent() {
  const [selectArea, setSelectArea] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    identificacion_plano: 0,
    tipo: " ",
    superficie: 0,
  });
  const [opcionesAreas, setOpcionesAreas] = useState<TipoAreasExteriores[]>([]);
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const cui_number = useAppSelector((state) => state.espacio_escolar.cui);
  const areasExteriores = useAppSelector(
    (state) => state.espacio_escolar.areasExteriores
  ); // Datos desde Redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const opciones =
          await areasExterioresService.getOpcionesAreasExteriores();
        setOpcionesAreas(opciones);
      } catch (error) {
        console.error("Error al obtener opciones de áreas exteriores:", error);
      }
    }
    fetchData();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    setSelectArea(selectedId);
    const selectedOption = opcionesAreas.find((op) => op.id === selectedId);
    if (selectedOption) {
      const tipoString = `${selectedOption.name}`;
      setFormData({ ...formData, tipo: tipoString });
    }
  };

  const handleInputChange = (name: keyof FormData, value: number) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.identificacion_plano ||
      !selectArea ||
      formData.superficie <= 0
    ) {
      toast.warning("Completá todos los campos antes de agregar un área");
      return;
    }

    const areaExistente = areasExteriores.some(
      (area) => area.identificacion_plano === formData.identificacion_plano
    );

    if (areaExistente) {
      toast.warning("Ya existe un área con esa identificación en el plano");
      return;
    }

    try {
      const newArea: AreasExteriores = {
        identificacion_plano: formData.identificacion_plano,
        tipo: formData.tipo,
        superficie: formData.superficie,
        relevamiento_id: relevamientoId,
      };

      dispatch(addAreasExteriores(newArea));
      setFormData({ identificacion_plano: 0, tipo: "", superficie: 0 });
      setSelectArea(null);
    } catch (error) {
      console.error("Error al agregar el área exterior:", error);
    }
  };

  const handleGuardarDatos = async () => {
    if (!cui_number) {
      console.error("No hay CUI definido.");
      toast.error("No se puede guardar: CUI no definido");
      return;
    }
    try {
      if (!areasExteriores.length) {
        toast.warning("No hay áreas exteriores para guardar");
        return;
      }
      const payload = areasExteriores.map((area) => ({
        ...area,
        cui_number,
        relevamiento_id: relevamientoId,
      }));


      await areasExterioresService.postAreasExteriores(payload);

      toast.success("Datos guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los datos en la base:", error);
      toast.error("Error al guardar los datos. Intentá nuevamente.");
    }
  };

  const handleEliminar = (identificacion_plano: number) => {
    dispatch(deleteAreasExteriores(identificacion_plano));
  };

  const columns = [
    { Header: "Identificación", accessor: "identificacion_plano" },
    { Header: "Tipo", accessor: "tipo" },
    { Header: "Superficie", accessor: "superficie" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }: { row: { original: AreasExteriores } }) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEliminar(row.original.identificacion_plano)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
            <p>4</p>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            ÁREAS EXTERIORES
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <table className="w-full text-sm text-center rounded-xl border border-gray-200 overflow-hidden">
            <thead>
              <tr className="bg-custom text-white">
                <th className="border p-2 rounded-tl-lg rounded-tr-lg">
                  Identificación en el plano
                </th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Superficie</th>
                <th className="border p-2 rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">
                  <AlphanumericInput
                    disabled={false}
                    subLabel="E"
                    label=""
                    value={formData.identificacion_plano}
                    onChange={(value) =>
                      handleInputChange("identificacion_plano", Number(value))
                    }
                  />
                </td>
                <td className="border p-2">
                  <Select
                    label=""
                    value={selectArea?.toString() || ""}
                    options={opcionesAreas.map((opcion) => ({
                      value: opcion.id,
                      label: `${opcion.prefijo} - ${opcion.name} `,
                    }))}
                    onChange={handleSelectChange}
                  />
                </td>
                <td className="border p-2">
                  <DecimalNumericInput
                    disabled={false}
                    subLabel="m²"
                    label=""
                    value={formData.superficie}
                    onChange={(value) =>
                      handleInputChange("superficie", Number(value))
                    }
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    type="submit"
                    className="text-sm bg-custom hover:bg-custom/50 text-white rounded-lg px-4 py-2"
                  >
                    + Agregar Área
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <ReusableTable data={areasExteriores} columns={columns} />
        {areasExteriores.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={handleGuardarDatos}
            >
              Guardar áreas exteriores
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
