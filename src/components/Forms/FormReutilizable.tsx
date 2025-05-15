import { Edificios } from "@/app/lib/Edificios";
import { useRouter } from "next/navigation"; // Importa useRouter
import { ChangeEvent, FormEvent, useState } from "react";
import ReusableTable from "../Table/TableReutilizable";
import Select from "../ui/SelectComponent";
import TextInput from "../ui/TextInput";

interface FormData {
  edificioB1: string;
  descripcion: number | null;
  descripcionOtro: string;
  nombreInstitucion: string;
}

interface FormValues {
  question: string;
}

const columns = [
  // Definición de las columnas para la tabla
  {
    Header: "Establecimiento NO-ESCOLAR/GESTION PRIVADA",
    accessor: "edificioB1",
  },
  {
    Header: "Descripción",
    accessor: "descripcion",
    Cell: ({ value }: { value: number | null }) =>
      Edificios.find((area) => area.id === value)?.name || "-",
  }, // Muestra el nombre del tipo
  { Header: "Descripción otro", accessor: "descripcionOtro" },
  { Header: "Nombre de la institución", accessor: "nombreInstitucion" },
];

const FormReutilizable: React.FC<FormValues> = () => {
  const [selectEdificio, setSelectEdificio] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    edificioB1: "",
    descripcion: null,
    descripcionOtro: "",
    nombreInstitucion: "",
  });
  const [tableData, setTableData] = useState<FormData[]>([]); // Datos para la tabla
  const [formValues, setFormValues] = useState<FormValues>({
    question: " ",
  });
  const [showMoreFields, setShowMoreFields] = useState(false);
  const router = useRouter(); // Inicializa useRouter

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormValues({ ...formValues, [name]: value });
    if (name === "question" && value === "Si") {
      setShowMoreFields(true);
    } else {
      setShowMoreFields(false);
    }
    setFormData({ ...formData, edificioB1: value });

    // Redirección si se selecciona "No"
    if (name === "question" && value === "No") {
      router.push("/relevamiento-predio/c");
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = Number(event.target.value);
    console.log(selectedType);
    setSelectEdificio(selectedType);
    setFormData({ ...formData, descripcion: selectedType }); // Actualiza el formData
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTableData([...tableData, formData]); // Agrega los datos a la tabla
    setFormData({
      edificioB1: "",
      descripcion: null,
      descripcionOtro: "",
      nombreInstitucion: "",
    }); // Limpia el formulario
    setSelectEdificio(null); // Resetea el select
    console.log("Datos a enviar:", formData); // Aquí puedes enviar los datos al backend
  };

  return (
    <div className="mx-10 mt-2 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Pregunta B1 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-200 font-bold text-gray-700">
            B1
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-800 font-medium">
              ¿Este establecimiento funciona en el edificio de una institución no escolar o en un edificio escolar cedido por el sector de gestión privada?
            </p>
            <div className="flex gap-4 text-sm text-gray-700">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="question"
                  value="Si"
                  checked={formValues.question === "Si"}
                  onChange={handleChange}
                />
                Sí
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="question"
                  value="No"
                  checked={formValues.question === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Pregunta B2 */}
        {showMoreFields && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-200 font-bold text-gray-700">
              B2
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-800 font-medium">
                ¿De qué tipo de institución se trata?
              </p>
              <Select
                label=""
                value={selectEdificio?.toString() || ""}
                options={Edificios.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
                onChange={handleSelectChange}
              />
              {selectEdificio === 9 && (
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-sm text-gray-600">
                    Otro. Indique:
                  </label>
                  <TextInput
                    label=""
                    sublabel=""
                    value={formData.descripcionOtro}
                    onChange={(e) => handleInputChange("descripcionOtro", e)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pregunta B3 */}
        {selectEdificio !== null && selectEdificio > 0 && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-200 font-bold text-gray-700">
              B3
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-800 font-medium">
                ¿Cuál es el nombre de la institución?
              </p>
              <TextInput
                label=""
                sublabel=""
                value={formData.nombreInstitucion}
                onChange={(e) => handleInputChange("nombreInstitucion", e)}
              />
            </div>
          </div>
        )}

        {/* Tabla */}
        <ReusableTable data={tableData} columns={columns} />

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm"
          >
            Cargar información
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReutilizable;
