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
  { Header: "Establecimiento NO-ESCOLAR/GESTION PRIVADA", accessor: "edificioB1" },
  {
    Header: "Descripción",
    accessor: "descripcion",
    Cell: ({ value }: {value: number|null}) =>
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
    setFormData({ edificioB1: "", descripcion: null, descripcionOtro: "", nombreInstitucion: ""  }); // Limpia el formulario
    setSelectEdificio(null); // Resetea el select
    console.log("Datos a enviar:", formData); // Aquí puedes enviar los datos al backend
  };

  return (
    <div className="mx-10 grid p-4 border">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex">
          <div className="w-10 h-10 flex justify-center items-center border text-black font-bold bg-slate-200">
            <p>B1</p>
          </div>
          <label
            htmlFor="question"
            className="border p-2 bg-slate-200 justify-center items-center"
          >
            Este establecimeinto ¿Funciona en el edificio de una institución no
            escolar o en un edificio escolar cedido por el sector de gestión
            privada?
          </label>
          <div className="flex items-center p-2 gap-2 text-sm font-bold ">
            <label>
              <input
                className="mr-2"
                type="radio"
                name="question"
                value="Si"
                checked={formValues.question === "si"}
                onChange={handleChange}
              />
              Sí
            </label>
            <label>
              <input
                className="mr-2"
                type="radio"
                name="question"
                value="No"
                checked={formValues.question === "no"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>
        <div className="flex items-center">
          {showMoreFields && (
            <div className="flex items-center">
              <div className="w-10 h-10 p-4 flex justify-center items-center border text-black font-bold bg-slate-200">
                <p>B2</p>
              </div>
              <label htmlFor="question" className="border p-2 bg-slate-200">
                ¿De qué tipo de institución se trata?
              </label>
              <div className="flex items-center p-2 gap-2 text-sm font-bold ">
                <Select
                  label=""
                  value={selectEdificio?.toString() || ""}
                  options={Edificios.map((local) => ({
                    value: local.id,
                    label: local.name,
                  }))}
                  onChange={handleSelectChange}
                />
              </div>
              {selectEdificio === 9 && (
                <div className="flex items-center justify-center gap-2">
                  <p>Otro. Indique:</p>
                  <TextInput
                    sublabel=""
                    label={""}
                    value={formData.descripcionOtro}
                    onChange={(event) =>
                      handleInputChange("descripcionOtro", event)
                    }
                  />
                </div>
              )}

            </div>
          )}
        </div>
        <div>
          {selectEdificio !== null && selectEdificio > 0 && (
            <div className="flex items-center">
              <div className="w-10 h-10 flex justify-center items-center border text-black font-bold bg-slate-200">
                <p>B3</p>
              </div>
              <label htmlFor="question" className="border p-2 bg-slate-200">
                ¿Cuál es el nombre de la institución?
              </label>
              <div className="flex items-center ml-2">
                <TextInput
                  sublabel=""
                  label={""}
                  value={formData.nombreInstitucion}
                  onChange={(event) =>
                    handleInputChange("nombreInstitucion", event)
                  }
                />
              </div>
            </div>
          )}
        </div>
       <ReusableTable data={tableData} columns={columns} />

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="text-sm font-bold bg-gray-200 p-4 rounded-md flex-nowrap"
          >
            Cargar Información
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReutilizable;
