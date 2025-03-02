"use client";

import { SituacionDominio } from "@/app/lib/SituacionDominio";
import EstablecimientosPredio from "@/components/Forms/EstablecimientosPredio";
import Navbar from "@/components/NavBar/NavBar";
import Check from "@/components/ui/Checkbox";
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AreasExterioresTable from "../components/AreasExterioresTable";
import FactoresRiesgoTable from "../components/FactoresRiesgoTable";
import ServiciosBasicosForm from "../components/ServiciosTable";
import ServiciosTransporteForm from "../components/ServiciosTrasnporteTable";
import { areasExterioresColumns } from "../config/areaExterior";
import {
  factoresRiesgoColumns,
  factoresRiesgoData,
} from "../config/factoresRiesgo";
import { serviciosColumns, serviciosData } from "../config/serviciosBasicos";
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
  const [selectSituacion, setSelectSituacion] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    descripcion: null,
    descripcionOtro: "",
    juicioCurso: "",
  });
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitucionesData | null>(null);
  const [selectedJuicio, setSelectedJuicio] = useState<string | null>(null); // Estado para el checkbox seleccionado      const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga

  //console.log('SELECTED INSTITUCION', selectedInstitution );

  useEffect(() => {
    const storedInstitution = localStorage.getItem("selectedInstitution");
    //console.log("storedInstitution", storedInstitution);
    if (storedInstitution) {
      try {
        const parsedInstitution = JSON.parse(storedInstitution);
        if (
          typeof parsedInstitution === "object" &&
          parsedInstitution !== null
        ) {
          //console.log("parsedInstitution", parsedInstitution);
          setSelectedInstitution(parsedInstitution);
          setLoading(false); // ¡IMPORTANTE!
        } else {
          console.warn(
            "Datos incorrectos en localStorage para selectedInstitution"
          );
          setError("Error al cargar la institución."); // Establece el error
          setLoading(false); // ¡IMPORTANTE!
        }
      } catch (error) {
        console.error(
          "Error al parsear selectedInstitution desde localStorage:",
          error
        );
        setError("Error al cargar la institución."); // Establece el error
        setLoading(false); // ¡IMPORTANTE!
      }
    } else {
      setLoading(false); // Si no hay nada en localStorage, no hay carga
    }
  }, []);

  if (loading) {
    return <div>Cargando institución...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedInstitution) {
    return <div>No se ha seleccionado ninguna institución.</div>; // Mensaje si no hay selección
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = Number(event.target.value);
    console.log(selectedType);
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
    console.log(formData);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormData({ descripcion: "", descripcionOtro: "", juicioCurso: "" }); // Limpia el formulario
    setSelectSituacion(null);
    console.log(formData);
  };

  return (
    <div className="h-full bg-white text-black text-sm mb-10">
      <Navbar />
      <div className="flex flex-col justify-center mt-20 mb-8">
        <div className="flex justify-end mx-4">
          <div className="flex flex-col items-end">
            <h1 className="font-bold">GESTIÓN ESTATAL</h1>
            <h4 className="text-sm">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h4>
          </div>
          <div className="w-10 h-10 ml-4 flex justify-center items-center text-black bg-slate-200 text-xl">
            <p>1</p>
          </div>
        </div>
      </div>
      <EstablecimientosPredio selectedInstitution={selectedInstitution} />

      <div className="flex items-center mx-10 mt-2 bg-slate-200 ">
        <div className="w-10 h-10 flex justify-center items-center border text-white font-bold bg-black text-sm">
          <p>1</p>
        </div>
        <p className="ml-2 text-sm font-bold">SITUACIÓN DEL DOMINIO</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mx-10 bg-slate-200">
          <div className="w-10 h-10 flex justify-center items-center">
            <p>1.1</p>
          </div>
          <p className="ml-2 text-sm">
            ¿Cúal es la situación de dominio de este predio?
          </p>
          <div className="ml-4 flex justify-center items-center gap-2 text-sm">
            <p>Descripción:</p>
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
              <div className="ml-4 flex justify-center items-center gap-2 text-sm">
                <p>Otra situación. Indique:</p>
                <TextInput
                  label={""}
                  value={formData.descripcionOtro}
                  onChange={(event) =>
                    handleInputChange("descripcionOtro", event)
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center mx-10 bg-slate-200">
          <div className="w-10 h-10 flex justify-center items-center">
            <p>1.2</p>
          </div>
          <p className="ml-2 text-sm ">
            ¿Existe algún juicio en curso con respecto a la tenencia de este
            predio?
          </p>
          <div className="ml-4 flex justify-center items-center gap-2 text-sm">
            <p>Si</p>
            <Check
              label=""
              checked={selectedJuicio === "SI"}
              onChange={() => handleJuicioChange("SI")}
              disabled={false}
            />
            <p>No</p>
            <Check
              label=""
              checked={selectedJuicio === "NO"}
              onChange={() => handleJuicioChange("NO")}
              disabled={false}
            />
            <p>No sabe</p>
            <Check
              label=""
              checked={selectedJuicio === "NO_SABE"}
              onChange={() => handleJuicioChange("NO_SABE")}
              disabled={false}
            />
          </div>
        </div>
        <div className="flex justify-end mx-10 mt-2">
          <button
            type="submit"
            className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
          >
            Cargar Información
          </button>
        </div>
      </form>
      <div className="flex flex-col mt-3 mx-10 bg-black border">
        <div className="p-2 justify-center items-center text-white font-bold">
          <p>SERVICIOS</p>
        </div>
        <div className="bg-white text-xs p-1">
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
            En caso de respuesta afirmativa, indique &quot;si&quot; y pase al item
            siguiente. En caso de respuesta negativa, indique &quot;no&quot; y pregunte si
            el servicio se encuentra disponible en un radio de 1km. En casi de
            respuesta afirmativa, pregunte ¿A que distancia del predio (en m.)
            está disponible el servicio? En caso de respuesta negativa, indique
            &quot;no&quot; y pase al item siguiente.
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
      <AreasExterioresTable columnsConfig={areasExterioresColumns} />
    </div>
  );
}
