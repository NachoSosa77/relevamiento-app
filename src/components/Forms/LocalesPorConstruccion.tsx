/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LocalesConstruccion, TipoLocales } from "@/interfaces/Locales";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLocales } from "@/redux/slices/espacioEscolarSlice";
import { localesService } from "@/services/localesServices";
import { useEffect, useState } from "react";
import ReusableTable from "../Table/TableReutilizable"; // Tabla reutilizable importada
import Check from "../ui/Checkbox";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import NumericInput from "../ui/NumericInput";
import Select from "../ui/SelectComponent";

export default function LocalesPorConstruccion() {
  const [selectLocales, setSelectLocales] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [opcionesLocales, setOpcionesLocales] = useState<TipoLocales[]>([]);
  const [formData, setFormData] = useState<LocalesConstruccion>({
    numero_construccion: 0,
    superficie_cubierta: 0,
    superficie_semicubierta: 0,
    superficie_total: 0,
    identificacion_plano: 0,
    numero_planta: 0,
    tipo: "",
    local_sin_uso: "No",
    superficie: 0,
    cui_number: 0,
  });
  const [tableData, setTableData] = useState<LocalesConstruccion[]>([]);

  const cui_number = useAppSelector((state) => state.espacio_escolar.cui);
  const localesRedux = useAppSelector((state) => state.espacio_escolar.locales);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await localesService.getOpcionesLocales();
        setOpcionesLocales(data);
      } catch (error) {
        console.error("Error al obtener opciones de locales:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (localesRedux.length > 0) {
      setTableData(localesRedux);
    }
  }, [localesRedux]);

  const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    setSelectLocales(selectedId);
    const selectedOption = opcionesLocales.find((op) => op.id === selectedId);
    if (selectedOption) {
      setFormData((prev) => ({ ...prev, tipo: selectedOption.name }));
    }
  };

  const handleSiChange = (checked: boolean) => {
    setChecked(checked);
    setFormData((prev) => ({ ...prev, local_sin_uso: checked ? "Si" : "No" }));
  };

  const calculoSuperficieTotal = (updatedFormData: LocalesConstruccion) => {
    const superficieTotal =
      (updatedFormData.superficie_cubierta ?? 0) +
      (updatedFormData.superficie_semicubierta ?? 0);
    setFormData((prev) => ({ ...prev, superficie_total: superficieTotal }));
  };

  const handleInputChange = (
    name: keyof LocalesConstruccion,
    value: number | undefined
  ) => {
    const updatedFormData = { ...formData, [name]: value ?? 0 };
    setFormData(updatedFormData);

    if (name === "superficie_cubierta" || name === "superficie_semicubierta") {
      calculoSuperficieTotal(updatedFormData);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newData: LocalesConstruccion = {
      ...formData,
      cui_number, // Aquí se incluye el CUI
      local_sin_uso: formData.local_sin_uso || "No",
    };

    let updatedData: LocalesConstruccion[];
    if (editIndex !== null) {
      updatedData = [...tableData];
      updatedData[editIndex] = newData;
      setEditIndex(null);
    } else {
      updatedData = [...tableData, newData];
    }

    setTableData(updatedData);
    dispatch(setLocales(updatedData));

    setFormData({
      numero_construccion: 0,
      superficie_cubierta: 0,
      superficie_semicubierta: 0,
      superficie_total: 0,
      identificacion_plano: 0,
      numero_planta: 0,
      tipo: "",
      local_sin_uso: "No",
      superficie: 0,
      cui_number: 0,
    });
    setSelectLocales(null);
    setChecked(false);
  };

  const handleEditar = (identificacionPlano: number) => {
    // Buscar el item usando identificacion_plano
    const item = tableData.find(
      (row) => row.identificacion_plano === identificacionPlano
    );

    if (!item) {
      console.error(
        "No se encontró el item con identificacion_plano:",
        identificacionPlano
      );
      return;
    }

    setFormData(item);
    setEditIndex(
      tableData.findIndex(
        (row) => row.identificacion_plano === identificacionPlano
      )
    ); // Guardamos el índice para el caso de actualizar
    setChecked(item.local_sin_uso === "Si");

    // Usamos 'identificacion_plano' para buscar el tipo de local
    const selectedOption = opcionesLocales.find((op) => op.name === item.tipo);
    setSelectLocales(selectedOption ? selectedOption.id : null);
  };

  const handleEliminar = (identificacion_plano: number) => {
    const nuevosLocales = tableData.filter(
      (local) => local.identificacion_plano !== identificacion_plano
    );
    setTableData(nuevosLocales);
    dispatch(setLocales(nuevosLocales));
  };

  const handleGuardarDatos = async () => {
      if (!cui_number) {
        console.error("No hay CUI definido.");
        return;
      }
      try {
        const payload = localesRedux.map((local) => ({
          ...local,
          cui_number,
        }));
  
        console.log("Payload a enviar:", payload);
  
        await localesService.postLocales(payload);
        
  
        console.log("Datos guardados correctamente:", payload);
      } catch (error) {
        console.error("Error al guardar los datos en la base:", error);
      }
    };

  //console.log("Datos de la tabla:", tableData);

  const columns = [
    { Header: "Identificación en el plano", accessor: "identificacion_plano" },
    { Header: "N° de planta", accessor: "numero_planta" },
    { Header: "Tipo de local", accessor: "tipo" },
    {
      Header: "Local sin uso",
      accessor: "local_sin_uso",
      Cell: ({ value }: { value: string }) => (value === "Si" ? "Sí" : "No"),
    },
    { Header: "Superficie (m²)", accessor: "superficie" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }: any) => {
        const id = row.original.id || row.original.identificacion_plano;
        return (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handleEditar(row.original.identificacion_plano)}
              className="bg-blue-500 text-white p-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => {
                const idToDelete = id;
                if (idToDelete) {
                  handleEliminar(idToDelete);
                } else {
                  console.error("ID no válido");
                }
              }}
              className="bg-red-500 text-white p-1 rounded"
            >
              Eliminar
            </button>
          </div>
        );
      },
    },
  ];
  
  return (
    <div className="mx-10  bg-white text-black">
      <div className="flex mt-2 p-4 border items-center justify-between">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black text-xl">
          <p>5</p>
        </div>
        <p className="text-lg font-bold ml-4">LOCALES POR CONSTRUCCIÓN</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Tabla de carga */}
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
                <NumericInput
                  disabled={false}
                  value={formData.numero_construccion}
                  onChange={(val) =>
                    handleInputChange("numero_construccion", val)
                  }
                  label=""
                  subLabel=""
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  value={formData.superficie_cubierta}
                  onChange={(val) =>
                    handleInputChange("superficie_cubierta", val)
                  }
                  label=""
                  subLabel=""
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  value={formData.superficie_semicubierta}
                  onChange={(val) =>
                    handleInputChange("superficie_semicubierta", val)
                  }
                  label=""
                  subLabel=""
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  value={formData.superficie_total}
                  onChange={() => {}}
                  label=""
                  subLabel="m²"
                  disabled={true}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Segunda tabla para agregar datos */}
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
                <NumericInput
                  value={formData.identificacion_plano}
                  onChange={(val) =>
                    handleInputChange("identificacion_plano", val)
                  }
                  label=""
                  subLabel=""
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <NumericInput
                  value={formData.numero_planta}
                  onChange={(val) => handleInputChange("numero_planta", val)}
                  label=""
                  subLabel=""
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <Select
                  label=""
                  value={selectLocales?.toString() || ""}
                  onChange={handleSelecteChange}
                  options={opcionesLocales.map((local) => ({
                    value: local.id,
                    label: `${local.id} - ${local.name}`,
                  }))}
                />
              </td>
              <td className="border p-2">
                <Check
                  checked={checked}
                  onChange={handleSiChange}
                  label="Local sin uso"
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  value={formData.superficie}
                  onChange={(val) => handleInputChange("superficie", val)}
                  label=""
                  subLabel="m²"
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <button
                  type="submit"
                  className="text-white bg-blue-500 px-4 py-2 rounded-md"
                >
                  Guardar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* Mostrar tabla con los datos guardados */}
      <ReusableTable data={tableData} columns={columns} />
      {tableData.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="text-sm font-bold bg-blue-500 text-white p-2 rounded-md"
            onClick={handleGuardarDatos}
          >
            Guardar Datos
          </button>
        </div>
      )}
    </div>
  );
}
