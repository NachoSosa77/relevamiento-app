"use client";

import { SituacionDominio } from "@/app/lib/SituacionDominio";
import EstablecimientosPredio from "@/components/Forms/EstablecimientosPredio";
import Navbar from "@/components/NavBar/NavBar";
import ObservacionesComponent from "@/components/ObservacionesComponent";
import Check from "@/components/ui/Checkbox";
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPredioId } from "@/redux/slices/predioSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation"; // ✅
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AreasExterioresTable from "../components/AreasExterioresTable";
import FactoresRiesgoTable from "../components/FactoresRiesgoTable";
import FormReu from "../components/FormReu";
import FormReuFuera from "../components/FormReuFuera";
import ObrasDentroDelPredio from "../components/ObrasDentroDelPredio";
import ObrasFueraDelPredio from "../components/ObrasFueraDElPredio";
import ServiciosBasicosForm from "../components/ServiciosTable";
import ServiciosTransporteForm from "../components/ServiciosTrasnporteTable";
import {
  factoresRiesgoColumns,
  factoresRiesgoData,
} from "../config/factoresRiesgo";
import {
  serviciosColumns,
  serviciosData,
} from "../config/serviciosBasicosHeader";
import {
  serviciosDataTransporte,
  serviciosTransporteComunicaciones,
} from "../config/serviciosTransporteComunicaciones";

interface FormData {
  descripcion: string | null;
  descripcionOtro: string;
  juicioCurso: string;
}

export default function RelevamientoCPage() {
  const router = useRouter();
  const [selectSituacion, setSelectSituacion] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    descripcion: null,
    descripcionOtro: "",
    juicioCurso: "",
  });
  const [selectedInstitutions, setSelectedInstitutions] = useState<
    InstitucionesData[]
  >([]);
  const [selectedJuicio, setSelectedJuicio] = useState<string | null>(null); // Estado para el checkbox seleccionado      const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  const [mostrarObras, setMostrarObras] = useState(false); // Estado elevado
  const [showFormFuera, setShowFormFuera] = useState(false);
  const [mostrarFuera, setMostrarFuera] = useState(false); // Nuevo estado para ObrasFueraDelPredio

  const dispatch = useAppDispatch();

  const institucionesRedux = useSelector(
    (state: RootState) => state.espacio_escolar.institucionesSeleccionadas
  );

  const relevamientoId = useRelevamientoId();
  const predioId = useAppSelector((state) => state.predio.predioId);

  useEffect(() => {
    if (institucionesRedux.length > 0) {
      setSelectedInstitutions(institucionesRedux);
    }
  }, [institucionesRedux]);

  const handleFormReuConfirm = () => {
    setShowFormFuera(true);
  };

  const handleSaveObservacion = async (obs: string) => {
    if (!predioId || !obs.trim()) return;

    try {
      const res = await fetch(`/api/predio/${predioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observaciones: obs }),
      });

      if (res.ok) {
        toast.success("Observaciones guardadas correctamente");
      } else {
        console.error("Error al guardar observaciones");
        toast.error("Observaciones guardadas correctamente");
      }
    } catch (err) {
      console.error("Error de red al guardar:", err);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = Number(event.target.value);
    setSelectSituacion(selectedType);
    // Buscar la descripción correspondiente al id seleccionado
    const selectedDescription = SituacionDominio.find(
      (item) => item.id === selectedType
    )?.name;
    setFormData({ ...formData, descripcion: selectedDescription || null }); // Actualiza el formData
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleJuicioChange = (juicio: string) => {
    setSelectedJuicio(juicio);
    setFormData({ ...formData, juicioCurso: juicio });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      relevamiento_id: relevamientoId,
      situacion: formData.descripcion,
      otra_situacion: formData.descripcionOtro,
      situacion_juicio: formData.juicioCurso,
    };

    try {
      const response = await fetch("/api/predio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error en el envío");

      const data = await response.json();
      const predioId = data.predioId; // ✅ propiedad correcta

      toast.success("Enviado con éxito");

      // Guardar el predioId (podés usar Redux, context o estado local)
      dispatch(setPredioId(predioId));
    } catch (error) {
      console.error("Error al enviar:", error);
      toast.error("Error al enviar");
    }

    setFormData({ descripcion: "", descripcionOtro: "", juicioCurso: "" });
    setSelectSituacion(null);
  };

  const enviarDatosEspacioEscolar = () => {
    if (!predioId) {
      toast.error("Primero debes completar y guardar los datos del predio.");
      return;
    }

    toast.success("Relevamiento predio guardado correctamente 🎉", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      router.push("/relevamiento-construcciones");
    }, 1000);
  };

  return (
    <div className="h-full bg-white text-black text-sm mt-28">
      <Navbar />
      <div className="flex flex-col justify-center mt-20 mb-8">
        <div className="flex justify-center mx-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold">GESTIÓN ESTATAL</h1>
            <h4 className="text-sm">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h4>
          </div>
          <div className="w-10 h-10 rounded-full ml-4 flex justify-center items-center text-white bg-custom text-xl">
            <p>1</p>
          </div>
        </div>
      </div>
      <EstablecimientosPredio selectedInstitutions={selectedInstitutions} />

      <div className="mx-8 my-6 border rounded-2xl">
        <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
              <p>1</p>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              SITUACIÓN DEL DOMINIO
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm"
          >
            {/* Pregunta 1.1 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm text-white bg-custom">
                  <p>1.1</p>
                </div>
                <p className="ml-4 text-sm text-gray-800">
                  ¿Cuál es la situación de dominio de este predio?
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 ml-14">
                <p className="text-sm text-gray-700">Descripción:</p>
                <Select
                  label=""
                  options={SituacionDominio.map((local) => ({
                    value: local.id,
                    label: local.name,
                  }))}
                  value={selectSituacion?.toString() || ""}
                  onChange={handleSelectChange}
                />
                {selectSituacion === 5 && (
                  <div className="flex items-center gap-2 text-sm">
                    <p>Otra situación. Indique:</p>
                    <TextInput
                      sublabel=""
                      label=""
                      value={formData.descripcionOtro}
                      onChange={(event) =>
                        handleInputChange("descripcionOtro", event)
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pregunta 1.2 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm text-white bg-custom">
                  <p>1.2</p>
                </div>
                <p className="ml-4 text-sm text-gray-800">
                  ¿Existe algún juicio en curso con respecto a la tenencia de
                  este predio?
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 ml-14 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <span>Sí</span>
                  <Check
                    label=""
                    checked={selectedJuicio === "Si"}
                    onChange={() => handleJuicioChange("Si")}
                    disabled={false}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>No</span>
                  <Check
                    label=""
                    checked={selectedJuicio === "No"}
                    onChange={() => handleJuicioChange("No")}
                    disabled={false}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>No sabe</span>
                  <Check
                    label=""
                    checked={selectedJuicio === "No sabe"}
                    onChange={() => handleJuicioChange("No sabe")}
                    disabled={false}
                  />
                </label>
              </div>
            </div>

            {/* Botón */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!selectedJuicio?.length}
                className={`${
                  !selectedJuicio?.length
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                } text-white text-sm font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50`}
              >
                Cargar Información
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col mt-3 mx-10 bg-custom rounded-2xl border">
        <div className="p-2 justify-center items-center text-white font-bold">
          <p>SERVICIOS</p>
        </div>
        <div className="bg-white text-xs p-2">
          <p>
            Pregunte si los servicios listados están disponibles en el predio.
            En caso de respuesta afirmativa, indique &quot;si&quot; y pase al
            ítem siguiente. En caso de respuesta negativa, indique
            &quot;no&quot; y pregunte si el servicio se encuentra disponible en
            un radio de 1km. En caso de respuesta afirmativa, pregunte ¿A qué
            distancia del predio (en m.) está disponible el servicio? En caso de
            respuesta negativa, indique &quot;no&quot; y pase al ítem siguiente.
          </p>{" "}
          <p>
            Pregunte si los servicios listados están disponbibles en el predio.
            En caso de respuesta afirmativa, indique &quot;si&quot; y pase al
            item siguiente. En caso de respuesta negativa, indique
            &quot;no&quot; y pregunte si el servicio se encuentra disponible en
            un radio de 1km. En casi de respuesta afirmativa, pregunte ¿A que
            distancia del predio (en m.) está disponible el servicio? En caso de
            respuesta negativa, indique &quot;no&quot; y pase al item siguiente.
          </p>
        </div>
      </div>
      <ServiciosBasicosForm
        serviciosData={serviciosData}
        columnsConfig={serviciosColumns}
      />
      <ServiciosTransporteForm
        serviciosData={serviciosDataTransporte}
        columnsConfig={serviciosTransporteComunicaciones}
      />
      <FactoresRiesgoTable
        serviciosData={factoresRiesgoData}
        columnsConfig={factoresRiesgoColumns}
      />
      <AreasExterioresTable />
      <FormReu
        setMostrarObras={setMostrarObras}
        question="¿Existen obras en este predio?"
        onConfirm={handleFormReuConfirm}
      />
      {mostrarObras && <ObrasDentroDelPredio mostrarObras={mostrarObras} />}
      {showFormFuera && (
        <FormReuFuera
          question="¿Hay obras en un predio no escolar, destinadas a alguno de los CUE-Anexos que funcionan acá?"
          setMostrarFuera={setMostrarFuera}
          onConfirm={() => {}} // Puedes agregar lógica adicional aquí si es necesario
        />
      )}

      {mostrarFuera && <ObrasFueraDelPredio mostrarObras={mostrarFuera} />}
      <ObservacionesComponent
        onSave={handleSaveObservacion}
        initialObservations={""}
      />
      <div className="flex justify-center mt-4">
        <button
          onClick={enviarDatosEspacioEscolar}
          className="px-4 py-2 w-80 bg-custom text-white font-semibold rounded-md hover:bg-custom/50"
        >
          Guardar Relevamiento del Predio
        </button>
      </div>
    </div>
  );
}
