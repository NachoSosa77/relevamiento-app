"use client";

import { Locales } from "@/app/lib/Locales";
import { TipoLocales } from "@/interfaces/Locales";
import { ChangeEvent, useState } from "react";
import ReusableTable from "../Table/TableReutilizable";
import AlphanumericInput from "../ui/AlphanumericInput";
import Check from "../ui/Checkbox";
import Select from "../ui/SelectComponent";

interface FormData {
  numeroConstruccion: number | null;
  superficieCubierta: number | null;
  superficieSemicubierta: number | null;
  superficieTotal: number | null;
  identificacionPlano: string;
  numeroPlanta: number | null;
  tipo: number | null;
  localSinUso: boolean;
  superficie: number | null;
}

export default function LocalesPorConstruccion() {
  const [selectLocales, setSelectLocales] = useState<number | null>(null);
  const [checked, setChecked] = useState(false); // Estado para el checkbox
  const [formData, setFormData] = useState<FormData>({
    numeroConstruccion: null,
    superficieCubierta: null,
    superficieSemicubierta: null,
    superficieTotal: null,
    identificacionPlano: "",
    numeroPlanta: null,
    tipo: null,
    localSinUso: false,
    superficie: null,
  });
  const [tableData, setTableData] = useState<FormData[]>([]); // Datos para la tabla
  const locales: TipoLocales[] = Locales;
  //console.log(locales, "locales");
  const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = Number(event.target.value);
    setSelectLocales(selectedType);
    setFormData({ ...formData, tipo: selectedType }); // Actualiza el formData
  };
  /* const selectedLocales = locales.find(
        (locales) => locales.id === setSelectLocales
      ); */
  const handleSiChange = (checked: boolean) => {
    setChecked(checked);
    setFormData({ ...formData, localSinUso: checked }); // Actualiza formData.localSinUso
  };    

  const calculoSuperficieTotal = (
    updatedFormData: FormData,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
  ): void => {
    const superficieTotal =
      (updatedFormData.superficieCubierta !== null
        ? Number(updatedFormData.superficieCubierta)
        : 0) +
      (updatedFormData.superficieSemicubierta !== null
        ? Number(updatedFormData.superficieSemicubierta)
        : 0);

    setFormData((prevFormData) => ({ ...prevFormData, superficieTotal: superficieTotal }));
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: newValue };
      if (name === "superficieCubierta" || name === "superficieSemicubierta") {
        calculoSuperficieTotal(updatedFormData, setFormData);
      }
      return updatedFormData;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTableData([...tableData, formData]); // Agrega los datos a la tabla
    setFormData({
      numeroConstruccion: null,
      superficieCubierta: null,
      superficieSemicubierta: null,
      superficieTotal: null,
      identificacionPlano: "",
      numeroPlanta: null,
      tipo: null,
      localSinUso: false,
      superficie: null,
    }); // Limpia el formulario
    setSelectLocales(null); // Resetea el select
    console.log("Datos a enviar:", formData); // Aquí puedes enviar los datos al backend
  };

  const columns = [
    // Definición de las columnas para la tabla
    { Header: "N° de Construcción", accessor: "numeroConstruccion" },
    { Header: "Superficie Cubierta", accessor: "superficieCubierta" },
    { Header: "Superficie Semicubierta", accessor: "superficieSemicubierta" },
    { Header: "Superficie Total", accessor: "superficieTotal" },
    { Header: "Identificación en el plano", accessor: "identificacionPlano" },
    { Header: "N° de planta", accessor: "numeroPlanta" },
    {
      Header: "Tipo de local",
      accessor: "tipo",
      Cell: ({ value }: { value: number }) =>
        locales.find((area) => area.id === value)?.name || "-",
    }, // Muestra el nombre del tipo
    { Header: "Local sin uso", accessor: "localSinUso", Cell: ({ value }: { value: string }) => value ? "Sí" : "No" },// Transformación para mostrar "Sí" o "No" 
    { Header: "Superficie", accessor: "superficie" },
  ];

  return (
    <div className="mx-10">
      <div className="flex mt-2 p-4 border items-center justify-between">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black text-xl">
          <p>5</p>
        </div>
        <div className="justify-center">
          <p className="text-lg font-bold ml-4">LOCALES POR CONSTRUCCIÓN</p>
        </div>
        <div className="flex flex-col p-2 text-xs text-gray-400 bg-gray-100 border justify-end">
          <p className="font-semibold text-center">Tipo de locales</p>
          <p>
            1-Aula común 2-Sala de nivel inicial 3-Aula especial 4-Laboratorio
            5-Taller 6-Gimnasio 7-Piscina cubierta
          </p>
          <p>
            8-Biblioteca/Centro de recursos 9-Sala de estudio 10-Salón de
            actos/Aula magna 11-Auitorio/Teatro
          </p>
          <p>
            12-Salón de usos múltiples/patio cubierto 13-Otro local pedagógico
            14-Oficina 15-Sala de reuniones
          </p>
          <p>
            16-Local para funciones de apoyo 17-Comedor 18-Cocina 19-Office
            20-Cantina 21-Sanitarios Alumnos
          </p>
          <p>
            22-Sanitarios docentes/personal 23-Vestuario 24-Alojamiento
            25-Deposito/Despensa 26-Sala de maquinas
          </p>
          <p>
            27-Hall/Acceso 28-Circulación 29-Porch/atrio 30-Otro (Indique)
            31-Sin destino especifico
          </p>
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
      {/* Encabezado de tabla */}
      <form onSubmit={handleSubmit}>
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              N° de Construcción:
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={formData.numeroConstruccion?.toString() || ""}
                onChange={(event) =>
                  handleInputChange("numeroConstruccion", event)
                }
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie cubierta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={formData.superficieCubierta?.toString() || ""}
                onChange={(event) =>
                  handleInputChange("superficieCubierta", event)
                }
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie semicubierta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={formData.superficieSemicubierta?.toString() || ""}
                onChange={(event) =>
                  handleInputChange("superficieSemicubierta", event)
                }
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie total
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="m²"
                label={""}
                value={formData.superficieTotal?.toString() || ""}
                onChange={() => console.log("Value")}
              />
            </div>
          </div>
          <div>
          </div>
        </div>
      {/* Cuerpo tabla */}
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2 no-warp whitespace-nowrap">
              Identificación en el plano
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="L"
                label={""}
                value={formData.identificacionPlano}
                onChange={(event) => handleInputChange("identificacionPlano", event)}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              N° de planta
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel=""
                label={""}
                value={formData.numeroPlanta?.toString() || ""}
                onChange={(event) => handleInputChange("numeroPlanta", event)}
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
                value={selectLocales?.toString() || ""}
                options={locales.map((local) => ({
                  value: local.id,
                  label: local.name,
                }))}
                onChange={handleSelecteChange}
              ></Select>
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Local sin uso
            </p>
            <div className="mt-2 w-full">
              <Check
                label={"Si"}
                checked={checked}
                onChange={handleSiChange}
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
                value={formData.superficie?.toString() || ""}
                onChange={(event) => handleInputChange("superficie", event)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
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
