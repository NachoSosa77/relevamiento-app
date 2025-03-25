"use client";

import { TipoLocales } from "@/interfaces/Locales";
import { useAppDispatch } from "@/redux/hooks";
import { setLocalId } from "@/redux/slices/espacioEscolarSlice";
import { localesService } from "@/services/localesServices";
import { ChangeEvent, useEffect, useState } from "react";
import ReusableTable from "../Table/TableReutilizable";
import AlphanumericInput from "../ui/AlphanumericInput";
import Check from "../ui/Checkbox";
import Select from "../ui/SelectComponent";

interface FormData {
  numero_construccion: number;
  superficie_cubierta: number;
  superficie_semicubierta: number;
  superficie_total: number;
  identificacion_plano: string;
  numero_planta: number;
  tipo_local_id: number;
  local_sin_uso: string;
  superficie: number;
}

export default function LocalesPorConstruccion() {
  const [selectLocales, setSelectLocales] = useState<number | null>(null);
  const [checked, setChecked] = useState(false); // Estado para el checkbox
  const [formData, setFormData] = useState<FormData>({
    numero_construccion: 0,
    superficie_cubierta: 0,
    superficie_semicubierta: 0,
    superficie_total: 0,
    identificacion_plano: "",
    numero_planta: 0,
    tipo_local_id: 0,
    local_sin_uso: "",
    superficie: 0,
  });
  const [opcionesLocales, setOpcionesLocales] = useState<TipoLocales[]>([]);
  const [tableData, setTableData] = useState<FormData[]>([]); // Datos para la tabla
  const dispatch = useAppDispatch(); 
  

  useEffect(() => {
      async function fetchData() {
        try {
          const data = await localesService.getOpcionesLocales();
          setOpcionesLocales(data);
        } catch (error) {
          console.error('Error al obtener opciones de áreas exteriores:', error);
        }
      }
      fetchData();
    }, []);



  const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = Number(event.target.value);
    setSelectLocales(selectedType);
    setFormData({ ...formData, tipo_local_id: selectedType }); // Actualiza el formData
  };
  /* const selectedLocales = locales.find(
        (locales) => locales.id === setSelectLocales
      ); */
  const handleSiChange = (checked: boolean) => {
    setChecked(checked);
    setFormData({ ...formData, local_sin_uso: checked ? "Si": "No" }); // Actualiza formData.localSinUso
  };    

  const calculoSuperficieTotal = (
    updatedFormData: FormData,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
  ): void => {
    const superficieTotal =
      (updatedFormData.superficie_cubierta !== null
        ? Number(updatedFormData.superficie_cubierta)
        : 0) +
      (updatedFormData.superficie_semicubierta !== null
        ? Number(updatedFormData.superficie_semicubierta)
        : 0);

    setFormData((prevFormData) => ({ ...prevFormData, superficie_total: superficieTotal }));
  };

  const handleInputChange = (
    name: keyof FormData,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: newValue };
      if (name === "superficie_cubierta" || name === "superficie_semicubierta") {
        calculoSuperficieTotal(updatedFormData, setFormData);
      }
      return updatedFormData;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try{
      const response = await localesService.postLocales(formData);
      console.log('Respuesta del backend:', response);
      dispatch(setLocalId(response.id)); // Asumiendo que la respuesta tiene un campo 'id'
      setTableData([...tableData, formData]);

      setFormData({
      numero_construccion: 0,
      superficie_cubierta: 0,
      superficie_semicubierta: 0,
      superficie_total: 0,
      identificacion_plano: "",
      numero_planta: 0,
      tipo_local_id: 0,
      local_sin_uso: "",
      superficie: 0,
      }); // Limpia el formulario
      setSelectLocales(null); // Resetea el select
    }catch(error){
      console.error('Error al enviar los datos:', error);
    }
  };

  const columns = [
    // Definición de las columnas para la tabla
    { Header: "N° de Construcción", accessor: "numero_construccion" },
    { Header: "Superficie Cubierta", accessor: "superficie_cubierta" },
    { Header: "Superficie Semicubierta", accessor: "superficie_semicubierta" },
    { Header: "Superficie Total", accessor: "superficie_total" },
    { Header: "Identificación en el plano", accessor: "identificacion_plano" },
    { Header: "N° de planta", accessor: "numero_planta" },
    {
      Header: "Tipo de local",
      accessor: "tipo_local_id",
      Cell: ({ value }: { value: number }) =>{
        const opcion = opcionesLocales.find((op) => op.id === Number(value));
        return opcion ? opcion.name : "No definido";}
    }, // Muestra el nombre del tipo
    { Header: "Local sin uso", accessor: "local_sin_uso", Cell: ({ value }: { value: string }) => value ? "Sí" : "No" },// Transformación para mostrar "Sí" o "No" 
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
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">N° de Construcción</th>
            <th className="border p-2">Superficie Cubierta</th>
            <th className="border p-2">Superficie Semicubierta</th>
            <th className="border p-2">Superficie Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              <AlphanumericInput label="" subLabel="" value={formData.numero_construccion?.toString() || ""} onChange={(event) => handleInputChange("numero_construccion", event)} />
            </td>
            <td className="border p-2">
              <AlphanumericInput label="" subLabel="" value={formData.superficie_cubierta?.toString() || ""} onChange={(event) => handleInputChange("superficie_cubierta", event)} />
            </td>
            <td className="border p-2">
              <AlphanumericInput label="" subLabel="" value={formData.superficie_semicubierta?.toString() || ""} onChange={(event) => handleInputChange("superficie_semicubierta", event)} />
            </td>
            <td className="border p-2">
              <AlphanumericInput subLabel="m²" label="" value={formData.superficie_total?.toString() || ""} onChange={() => console.log("Value")} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Identificación en el Plano</th>
            <th className="border p-2">N° de Planta</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Local sin uso</th>
            <th className="border p-2">Superficie</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              <AlphanumericInput label="" subLabel="" value={formData.identificacion_plano || ""} onChange={(event) => handleInputChange("identificacion_plano", event)} />
            </td>
            <td className="border p-2">
              <AlphanumericInput label="" subLabel="" value={formData.numero_planta?.toString() || ""} onChange={(event) => handleInputChange("numero_planta", event)} />
            </td>
            <td className="border p-2">
              <Select label=" " value={selectLocales?.toString() || ""} options={opcionesLocales.map((local) => ({ value: local.id, label: local.name }))} onChange={handleSelecteChange} />
            </td>
            <td className="border p-2 text-center">
              <Check label="Si" checked={checked} onChange={handleSiChange} />
            </td>
            <td className="border p-2">
              <AlphanumericInput label=" " subLabel="m²" value={formData.superficie?.toString() || ""} onChange={(event) => handleInputChange("superficie", event)} />
            </td>
            <td className="border p-2 text-center">
              <button type="submit" className="text-sm font-bold bg-slate-200 p-2 rounded-md">Cargar Información</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
      <ReusableTable data={tableData} columns={columns} />
    </div>
  );
}
