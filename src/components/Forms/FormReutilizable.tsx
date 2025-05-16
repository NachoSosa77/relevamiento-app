import { Edificios } from "@/app/lib/Edificios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import BloquePregunta from "../BloquePregunta";
import ReusableTable from "../Table/TableReutilizable";
import Select from "../ui/SelectComponent";
import TextInput from "../ui/TextInput";

interface FormData {
  corresponde: string;
  tipo_institucion: string;
  descripcion_otro: string;
  nombre_institucion: string;
}

const columns = [
  {
    Header: "Establecimiento NO-ESCOLAR/GESTIÓN PRIVADA",
    accessor: "corresponde",
  },
  {
  Header: "Descripción",
  accessor: "tipo_institucion",
  Cell: ({ value }: { value: string }) => value || "-",
},
  { Header: "Descripción otro", accessor: "descripcion_otro" },
  { Header: "Nombre de la institución", accessor: "nombre_institucion" },
];

const FormReutilizable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    corresponde: "",
    tipo_institucion: "",
    descripcion_otro: "",
    nombre_institucion: "",
  });
  const [tableData, setTableData] = useState<FormData[]>([]);
  const [respuestaB1, setRespuestaB1] = useState<string>("");
  const [selectedEdificioId, setSelectedEdificioId] = useState<number | null>(
    null
  );

  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const router = useRouter();

  const handleB1Change = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRespuestaB1(value);
    setFormData((prev) => ({ ...prev, corresponde: value }));

    if (value === "No") {
      router.push("/relevamiento-predio/c");
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    const selectedEdificio = Edificios.find((e) => e.id === selectedId);

    setSelectedEdificioId(selectedId);
    setFormData((prev) => ({
      ...prev,
      tipo_institucion: selectedEdificio?.name || "",
      descripcion_otro: selectedId === 9 ? prev.descripcion_otro : "",
    }));
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nuevoRegistro = { ...formData, relevamiento_id: relevamientoId };

    try {
      const res = await fetch("/api/establecimientos_no_escolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([nuevoRegistro]),
      });

      if (!res.ok) throw new Error("Error al guardar en base de datos");

      toast.success("Registro guardado con éxito ✅");
      setTableData((prev) => [...prev, formData]);

      // Reset formulario
      setFormData({
        corresponde: "",
        tipo_institucion: "",
        descripcion_otro: "",
        nombre_institucion: "",
      });
      setRespuestaB1("");
      setSelectedEdificioId(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar en la base de datos ❌");
    }
  };

  const mostrarCamposAdicionales = respuestaB1 === "Si";
  const mostrarCampoOtro = selectedEdificioId === 9;
  const mostrarCampoNombreInstitucion = selectedEdificioId !== null;

  return (
    <div className="mx-10 mt-2 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* B1 */}
        <BloquePregunta label="B1">
          <p className="text-sm text-gray-800 font-medium">
            ¿Este establecimiento funciona en el edificio de una institución no
            escolar o en un edificio escolar cedido por el sector de gestión
            privada?
          </p>
          <div className="flex gap-4 text-sm text-gray-700 mt-2">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="corresponde"
                value="Si"
                checked={respuestaB1 === "Si"}
                onChange={handleB1Change}
              />
              Sí
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="corresponde"
                value="No"
                checked={respuestaB1 === "No"}
                onChange={handleB1Change}
              />
              No
            </label>
          </div>
        </BloquePregunta>

        {/* B2 */}
        {mostrarCamposAdicionales && (
          <>
            <BloquePregunta label="B2">
              <p className="text-sm text-gray-800 font-medium">
                ¿De qué tipo de institución se trata?
              </p>
              <Select
                label=""
                value={selectedEdificioId?.toString() || ""}
                options={Edificios.map((e) => ({
                  value: e.id.toString(),
                  label: `${e.prefijo} - ${e.name}`,
                }))}
                onChange={handleSelectChange}
              />
            </BloquePregunta>
            {mostrarCampoOtro && (
                <div className="flex items-center">
                <p className="text-sm text-gray-600">Otro. Indique:</p>
                <TextInput
                  label=""
                  sublabel=""
                  value={formData.descripcion_otro}
                  onChange={(e) => handleInputChange("descripcion_otro", e)}
                />
                </div>
            )}

            {/* B3 */}
            {mostrarCampoNombreInstitucion && (
              <BloquePregunta label="B3">
                                <div className="flex items-center">

                <p className="text-sm text-gray-800 font-medium">
                  ¿Cuál es el nombre de la institución?
                </p>
                <TextInput
                  label=""
                  sublabel=""
                  value={formData.nombre_institucion}
                  onChange={(e) => handleInputChange("nombre_institucion", e)}
                />
                                </div>

              </BloquePregunta>
            )}
          </>
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
