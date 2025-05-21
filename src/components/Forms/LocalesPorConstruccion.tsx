/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LocalesConstruccion, TipoLocales } from "@/interfaces/Locales";
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

export default function LocalesPorConstruccion() {
  const [opcionesLocales, setOpcionesLocales] = useState<TipoLocales[]>([]);
  const [superficiesPorConstruccion, setSuperficiesPorConstruccion] = useState<
    Record<number, { cubierta: number; semicubierta: number; total: number }>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);

  const cantidadConstrucciones = useAppSelector(
    (state) => state.espacio_escolar.cantidadConstrucciones
  );
  const [localesPorConstruccion, setLocalesPorConstruccion] = useState<
    Record<number, LocalesConstruccion[]>
  >({});
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const cuiNumber = useAppSelector((state) => state.espacio_escolar.cui);

  const [formValues, setFormValues] = useState<
    Record<number, LocalesConstruccion>
  >({});

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

    const initialValues: Record<number, LocalesConstruccion> = {};
    for (let i = 0; i < cantidadConstrucciones; i++) {
      initialValues[i] = {
        identificacion_plano: 0,
        numero_planta: 0,
        tipo: "",
        local_id: 0,
        tipo_superficie: "",
        local_sin_uso: "No",
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
        // Aseguramos que se trate como número
        const superficie =
          parseFloat(local.superficie as unknown as string) || 0;

        if (local.tipo_superficie === "Cubierta") cubierta += superficie;
        else if (local.tipo_superficie === "Semicubierta")
          semicubierta += superficie;
      }

      const cubiertaRedondeada = parseFloat(cubierta.toFixed(2));
      const semicubiertaRedondeada = parseFloat(semicubierta.toFixed(2));
      const total = parseFloat(
        (cubiertaRedondeada + semicubiertaRedondeada).toFixed(2)
      );

      nuevasSuperficies[idx] = {
        cubierta: cubiertaRedondeada,
        semicubierta: semicubiertaRedondeada,
        total,
      };
    });

    setSuperficiesPorConstruccion(nuevasSuperficies);
  }, [localesPorConstruccion, opcionesLocales]);

  const handleFormChange = (
    construccionIndex: number,
    field: keyof LocalesConstruccion,
    value: string | number | boolean | undefined
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        ...prev[construccionIndex],
        // Si es el campo local_sin_uso, transformamos boolean a "Si" o "No"
        [field]: field === "local_sin_uso" ? (value ? "Si" : "No") : value,
      },
    }));
  };

  const handleAddLocal = (construccionIndex: number) => {
    const local = formValues[construccionIndex];

    if (!local) return;

    // Validación de campos obligatorios
    const camposInvalidos: (keyof LocalesConstruccion)[] = [];

    if (!local.identificacion_plano)
      camposInvalidos.push("identificacion_plano");
    if (!local.tipo) camposInvalidos.push("tipo");
    if (!local.local_id || local.local_id === 0)
      camposInvalidos.push("local_id");
    if (!local.tipo_superficie) camposInvalidos.push("tipo_superficie");
    if (camposInvalidos.length > 0) {
      toast.warning(
        "Por favor, completa todos los campos obligatorios antes de agregar el local."
      );
      return;
    }

    // Si pasa la validación, agregamos el local
    setLocalesPorConstruccion((prev) => ({
      ...prev,
      [construccionIndex]: [...(prev[construccionIndex] || []), local],
    }));

    // Reset form para este tab
    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        identificacion_plano: 0,
        numero_planta: 0,
        tipo: "",
        local_id: 0,
        tipo_superficie: "",
        local_sin_uso: "No", // string
        superficie: 0,
      },
    }));
  };

  const handleSubmit = async () => {
  try {
    // Solo locales del tab activo
    const locales = localesPorConstruccion[activeIndex] || [];

    // Validación: impedir enviar si no hay locales
    if (locales.length === 0) {
      toast.warning("Debe agregar al menos un local antes de guardar.");
      return;
    }

    const numeroConstruccion = activeIndex + 1;

    console.log("Active index:", activeIndex);
console.log("Número construcción:", numeroConstruccion);

    // 1. Crear construcción
    const construccion = await localesService.postConstrucciones({
      numero_construccion: numeroConstruccion,
      relevamiento_id: relevamientoId,
      superficie_cubierta:
        superficiesPorConstruccion[activeIndex]?.cubierta || 0,
      superficie_semicubierta:
        superficiesPorConstruccion[activeIndex]?.semicubierta || 0,
      superficie_total: superficiesPorConstruccion[activeIndex]?.total || 0,
    });

    // 2. Prepara locales para enviar
    const localesConConstruccionId = locales.map((local) => ({
      ...local,
      construccion_id: construccion.construccion_id,
      local_id: local.local_id,
      tipo_superficie: local.tipo_superficie,
      cui_number: cuiNumber,
      local_sin_uso: local.local_sin_uso === "Si" ? "Si" : "No",
      relevamiento_id: relevamientoId,
    }));

    await localesService.postLocales(localesConConstruccionId);

    toast.success("Construcción y locales guardados correctamente");
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
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-black text-sm font-semibold">
            <p>3</p>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            LOCALES POR CONSTRUCCIÓN
          </p>
        </div>
        <Tab.Group selectedIndex={activeIndex} onChange={setActiveIndex}>
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
                        <DecimalNumericInput
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
                        value={
                          formValues[idx].local_id
                            ? formValues[idx].local_id.toString()
                            : ""
                        }
                        options={opcionesLocales.map((local) => ({
                          value: local.id.toString(), // value como string
                          label: `${local.id} - ${local.name}`,
                        }))}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value, 10); // convertir a número
                          const selected = opcionesLocales.find(
                            (local) => local.id === selectedId
                          );
                          if (selected) {
                            handleFormChange(idx, "tipo", selected.name);
                            handleFormChange(idx, "local_id", selected.id); // guardar como número
                          }
                        }}
                      />

                      <Select
                        label="Tipo de superficie"
                        value={formValues[idx].tipo_superficie}
                        options={[
                          { value: "Cubierta", label: "Cubierta" },
                          { value: "Semicubierta", label: "Semicubierta" },
                        ]}
                        onChange={(e) =>
                          handleFormChange(
                            idx,
                            "tipo_superficie",
                            e.target.value
                          )
                        }
                      />

                      <Check
                        label="Local sin uso"
                        checked={formValues[idx].local_sin_uso === "Si"}
                        onChange={(checked) =>
                          handleFormChange(idx, "local_sin_uso", checked)
                        }
                      />
                      <DecimalNumericInput
                        label="Superficie"
                        value={formValues[idx].superficie ?? 0}
                        onChange={(value) =>
                          handleFormChange(idx, "superficie", value)
                        }
                      />
                    </div>

                    <div className="flex justify-end mb-4">
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
                        {
                          Header: "ID Plano",
                          accessor: "identificacion_plano",
                        },
                        { Header: "N° Planta", accessor: "numero_planta" },
                        { Header: "Tipo", accessor: "tipo" },
                        {
                          Header: "Sin uso",
                          accessor: "local_sin_uso",
                          Cell: ({ value }) => (
                            <span>
                              {value === true || value === "Si" ? "Sí" : "No"}
                            </span>
                          ),
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
                              onClick={() =>
                                handleEliminarLocal(idx, row.index)
                              }
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
    </div>
  );
}
