/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TipoLocales } from "@/interfaces/Locales";
import { useAppSelector } from "@/redux/hooks";
import { localesService } from "@/services/localesServices";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReusableTable from "../Table/TableReutilizable";
import Check from "../ui/Checkbox";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import NumericInput from "../ui/NumericInput";
import Select from "../ui/SelectComponent";

interface Local {
  identificacion_plano: number;
  numero_planta: number;
  tipo: string;
  tipo_superficie: string;
  local_sin_uso: boolean;
  superficie: number;
}

export default function LocalesPorConstruccion() {
  const [opcionesLocales, setOpcionesLocales] = useState<TipoLocales[]>([]);
  const [superficiesPorConstruccion, setSuperficiesPorConstruccion] = useState<
    Record<number, { cubierta: number; semicubierta: number; total: number }>
  >({});
  const cantidadConstrucciones = useAppSelector(
    (state) => state.espacio_escolar.cantidadConstrucciones
  );
  const [localesPorConstruccion, setLocalesPorConstruccion] = useState<
    Record<number, Local[]>
  >({});
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const [formValues, setFormValues] = useState<Record<number, Local>>({});

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
    if (cantidadConstrucciones === undefined) return;

    const initialValues: Record<number, Local> = {};
    for (let i = 0; i < cantidadConstrucciones; i++) {
      initialValues[i] = {
        identificacion_plano: 0,
        numero_planta: 0,
        tipo: "",
        tipo_superficie: "",
        local_sin_uso: false,
        superficie: 0,
      };
    }
    setFormValues(initialValues);
  }, [cantidadConstrucciones]);

  useEffect(() => {
    const nuevasSuperficies: typeof superficiesPorConstruccion = {};

    Object.entries(localesPorConstruccion).forEach(([idxStr, locales]) => {
      const idx = parseInt(idxStr);
      let cubierta = 0;
      let semicubierta = 0;

      for (const local of locales) {
        const superficie = local.superficie ?? 0;

        if (local.tipo_superficie === "Cubierta") cubierta += superficie;
        else if (local.tipo_superficie === "Semicubierta")
          semicubierta += superficie;
      }

      nuevasSuperficies[idx] = {
        cubierta,
        semicubierta,
        total: cubierta + semicubierta,
      };
    });

    setSuperficiesPorConstruccion(nuevasSuperficies);
  }, [localesPorConstruccion, opcionesLocales]);

  const handleFormChange = (
    construccionIndex: number,
    field: keyof Local,
    value: any
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        ...prev[construccionIndex],
        [field]: value,
      },
    }));
  };

  const handleAddLocal = (construccionIndex: number) => {
    const local = formValues[construccionIndex];

    if (!local) return;

    setLocalesPorConstruccion((prev) => ({
      ...prev,
      [construccionIndex]: [...(prev[construccionIndex] || []), local],
    }));

    // Reset form for this tab
    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        identificacion_plano: 0,
        numero_planta: 0,
        tipo: "",
        tipo_superficie: "",
        local_sin_uso: false,
        superficie: 0,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const [indexStr, locales] of Object.entries(
        localesPorConstruccion
      )) {
        const numeroConstruccion = parseInt(indexStr) + 1;

        // 1. Crear construcción
        const construccion = await localesService.postConstrucciones({
          ...locales,
          numero_construccion: numeroConstruccion,
          relevamiento_id: relevamientoId,

        });

        console.log('CONSTRUCCION', construccion)

        // 2. Enviar locales con construccion_id agregado a cada uno
        const localesEnviar = await localesService.postLocales(
          locales.map((local) => ({
            ...local,
            construccion_id: construccion.construccion_id,
            local_sin_uso: String(local.local_sin_uso), // 👈 convierte el boolean a string
          }))
        );
        console.log('locales a enviar', localesEnviar)
      }

      toast.success("Construcciones y locales guardados correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Hubo un error al guardar los datos");
    }
  };

  const handleEliminarLocal = (
    construccionIndex: number,
    localIndex: number
  ) => {
    setLocalesPorConstruccion((prev) => {
      const copiaLocales = { ...prev };
      const localesActualizados =
        copiaLocales[construccionIndex]?.filter((_, i) => i !== localIndex) ||
        [];
      return {
        ...copiaLocales,
        [construccionIndex]: localesActualizados,
      };
    });
  };

  if (!cantidadConstrucciones) return null;

  return (
    <div className="mx-8 my-6">
      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b">
          {Array.from({ length: cantidadConstrucciones }).map((_, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                clsx(
                  "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-300",
                  selected
                    ? "bg-blue-600 text-white shadow font-semibold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )
              }
            >
              Construcción {idx + 1}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="bg-white border rounded-b-lg p-4 shadow">
          {Array.from({ length: cantidadConstrucciones }).map((_, idx) => (
            <Tab.Panel key={idx}>
              {!formValues[idx] ? (
                <div className="text-gray-500">
                  Cargando datos del formulario...
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Locales para Construcción {idx + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl shadow-sm border mb-6">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">
                        N° Construcción
                      </label>
                      <NumericInput
                        value={idx + 1}
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">
                        Superficie cubierta (m²)
                      </label>
                      <DecimalNumericInput
                        value={superficiesPorConstruccion[idx]?.cubierta || 0}
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">
                        Superficie semicubierta (m²)
                      </label>
                      <DecimalNumericInput
                        value={
                          superficiesPorConstruccion[idx]?.semicubierta || 0
                        }
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">
                        Total (m²)
                      </label>
                      <NumericInput
                        value={superficiesPorConstruccion[idx]?.total || 0}
                        disabled={true}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded-xl">
                    <NumericInput
                      label="Identificación en el plano"
                      value={formValues[idx].identificacion_plano}
                      onChange={(value) =>
                        handleFormChange(idx, "identificacion_plano", value)
                      }
                    />
                    <NumericInput
                      label="Número de planta"
                      value={formValues[idx].numero_planta}
                      onChange={(value) =>
                        handleFormChange(idx, "numero_planta", value)
                      }
                    />
                    <Select
                      label="Tipo de local"
                      value={formValues[idx].tipo}
                      options={opcionesLocales.map((local) => ({
                        value: local.name,
                        label: `${local.id} - ${local.name}`,
                      }))}
                      onChange={(e) =>
                        handleFormChange(idx, "tipo", e.target.value)
                      }
                    />
                    <Select
                      label="Tipo de superficie"
                      value={formValues[idx].tipo_superficie}
                      options={[
                        { value: "Cubierta", label: "Cubierta" },
                        { value: "Semicubierta", label: "Semicubierta" },
                      ]}
                      onChange={(e) =>
                        handleFormChange(idx, "tipo_superficie", e.target.value)
                      }
                    />

                    <Check
                      label="Local sin uso"
                      checked={formValues[idx].local_sin_uso}
                      onChange={(checked) =>
                        handleFormChange(idx, "local_sin_uso", checked)
                      }
                    />
                    <DecimalNumericInput
                      label="Superficie"
                      value={formValues[idx].superficie}
                      onChange={(value) =>
                        handleFormChange(idx, "superficie", value)
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleAddLocal(idx)}
                      className="text-sm bg-blue-600 text-white rounded-lg px-4 py-2"
                    >
                      + Agregar local
                    </button>
                  </div>

                  {/* Mostrar tabla de locales */}
                  <ReusableTable
                    data={localesPorConstruccion[idx] || []}
                    columns={[
                      { Header: "ID Plano", accessor: "identificacion_plano" },
                      { Header: "N° Planta", accessor: "numero_planta" },
                      { Header: "Tipo", accessor: "tipo" },
                      {
                        Header: "Sin uso",
                        accessor: "local_sin_uso",
                        Cell: ({ value }) => <span>{value ? "Sí" : "No"}</span>,
                      },
                      { Header: "Superficie", accessor: "superficie" },
                      {
                        Header: "Tipo superficie",
                        accessor: "tipo_superficie",
                      },
                      {
                        Header: "Acciones",
                        accessor: "acciones",
                        Cell: ({ row }: { row: any }) => (
                          <button
                            onClick={() => handleEliminarLocal(idx, row.index)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300"
                          >
                            Eliminar
                          </button>
                        ),
                      },
                    ]}
                  />
                </>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Guardar locales por construcción
        </button>
      </div>
    </div>
  );
}
