/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRelevamientoId } from "@/hooks/useRelevamientoId";
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
  const [editando, setEditando] = useState(false);
  const [construccionesExistentes, setConstruccionesExistentes] = useState<
    Record<number, number | undefined>
  >({});

  const cantidadConstrucciones = useAppSelector(
    (state) => state.espacio_escolar.cantidadConstrucciones
  );
  const [localesPorConstruccion, setLocalesPorConstruccion] = useState<
    Record<number, LocalesConstruccion[]>
  >({});
  const relevamientoId = useRelevamientoId();
  const cuiNumber = useAppSelector((state) => state.espacio_escolar.cui);

  const [formValues, setFormValues] = useState<
    Record<number, LocalesConstruccion>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localesService.getOpcionesLocales().then(setOpcionesLocales);
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
        const superficie =
          parseFloat(local.superficie as unknown as string) || 0;
        if (local.tipo_superficie === "Cubierta") cubierta += superficie;
        else if (local.tipo_superficie === "Semicubierta")
          semicubierta += superficie;
      }
      nuevasSuperficies[idx] = {
        cubierta: parseFloat(cubierta.toFixed(2)),
        semicubierta: parseFloat(semicubierta.toFixed(2)),
        total: parseFloat((cubierta + semicubierta).toFixed(2)),
      };
    });
    setSuperficiesPorConstruccion(nuevasSuperficies);
  }, [localesPorConstruccion]);

  useEffect(() => {
    async function fetchLocalesExistentes() {
      if (typeof relevamientoId !== "number") return;
      try {
        const respuesta = await localesService.getLocalesPorRelevamiento(
          relevamientoId
        );
        if (respuesta && respuesta.length > 0) {
          console.log("Locales existentes:", respuesta);
          const agrupados = respuesta.reduce((acc: any, local: any) => {
            const idx = (local.numero_construccion || 1) - 1;
            if (!acc[idx]) acc[idx] = [];
            acc[idx].push(local);
            return acc;
          }, {});

          const construcciones = respuesta.reduce((acc: any, local: any) => {
            const idx = (local.numero_construccion || 1) - 1;
            acc[idx] = local.construccion_id; // 👈 guardamos id
            return acc;
          }, {});
          setLocalesPorConstruccion(agrupados);
          setConstruccionesExistentes(construcciones);
          setEditando(true);
        }
      } catch (error) {
        console.error("Error al cargar locales previos:", error);
      }
    }

    if (relevamientoId) fetchLocalesExistentes();
  }, [relevamientoId]);

  const recalcularSuperficies = (
    locales: (typeof localesPorConstruccion)[0]
  ) => {
    let cubierta = 0;
    let semicubierta = 0;

    locales.forEach((local) => {
      if (local.tipo_superficie === "Cubierta") {
        cubierta += Number(local.superficie) || 0;
      } else if (local.tipo_superficie === "Semicubierta") {
        semicubierta += Number(local.superficie) || 0;
      }
    });

    const total = cubierta + semicubierta;

    setSuperficiesPorConstruccion(prev => ({
  ...prev,
  [activeIndex]: {
    cubierta,
    semicubierta,
    total,
  },
}));
  };

  const handleFormChange = (
    construccionIndex: number,
    field: keyof LocalesConstruccion,
    value: string | number | boolean | undefined
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        ...prev[construccionIndex],
        [field]: field === "local_sin_uso" ? (value ? "Si" : "No") : value,
      },
    }));
  };

  const handleAddLocal = (construccionIndex: number) => {
    const local = formValues[construccionIndex];
    if (!local) return;

    const camposObligatorios: (keyof LocalesConstruccion)[] = [
      "identificacion_plano",
      "tipo",
      "local_id",
      "tipo_superficie",
    ];
    const camposInvalidos = camposObligatorios.filter((campo) => !local[campo]);
    if (camposInvalidos.length > 0) {
      toast.warning("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const nuevoLocal = {
      ...local,
      id: undefined, // aseguramos que no tenga id si es nuevo
    };

    setLocalesPorConstruccion((prev) => ({
      ...prev,
      [construccionIndex]: [...(prev[construccionIndex] || []), nuevoLocal],
    }));

    setFormValues((prev) => ({
      ...prev,
      [construccionIndex]: {
        identificacion_plano: 0,
        numero_planta: 0,
        tipo: "",
        local_id: 0,
        tipo_superficie: "",
        local_sin_uso: "No",
        superficie: 0,
      },
    }));
  };

  const handleSubmit = async () => {
    console.log("editando:", editando);
    console.log("construccionesExistentes:", construccionesExistentes);
    console.log(
      "construccionesExistentes[activeIndex]:",
      construccionesExistentes[activeIndex]
    );
    console.log("activeIndex:", activeIndex);
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const locales = localesPorConstruccion[activeIndex] || [];
      if (locales.length === 0) {
        toast.warning("Debe agregar al menos un local.");
        setIsSubmitting(false);
        return;
      }

      const numeroConstruccion = activeIndex + 1;

      let construccionId: number | undefined;

      if (editando && construccionesExistentes[activeIndex]) {
        // Actualizo construcción existente
        await localesService.putConstruccion(
          construccionesExistentes[activeIndex],
          {
            numero_construccion: numeroConstruccion,
            relevamiento_id: relevamientoId,
            superficie_cubierta:
              superficiesPorConstruccion[activeIndex]?.cubierta || 0,
            superficie_semicubierta:
              superficiesPorConstruccion[activeIndex]?.semicubierta || 0,
            superficie_total:
              superficiesPorConstruccion[activeIndex]?.total || 0,
          }
        );
        construccionId = construccionesExistentes[activeIndex];
      } else {
        // Creo nueva construcción
        const construccion = await localesService.postConstrucciones({
          numero_construccion: numeroConstruccion,
          relevamiento_id: relevamientoId,
          superficie_cubierta:
            superficiesPorConstruccion[activeIndex]?.cubierta || 0,
          superficie_semicubierta:
            superficiesPorConstruccion[activeIndex]?.semicubierta || 0,
          superficie_total: superficiesPorConstruccion[activeIndex]?.total || 0,
        });
        console.log("Construcción creada (frontend):", construccion);

        construccionId = construccion.construccion_id;

        // Actualizo estado local con el nuevo id y marco como editando
        setConstruccionesExistentes((prev) => ({
          ...prev,
          [activeIndex]: construccionId,
        }));
        setEditando(true);
      }

      if (!construccionId || !relevamientoId || !cuiNumber) {
        toast.error("Faltan datos obligatorios para guardar los locales.");
        setIsSubmitting(false);
        return;
      }

      const localesConDatos: (LocalesConstruccion & {
        construccion_id: number;
      })[] = locales.map((local) => ({
        ...local,
        construccion_id: construccionId,
        cui_number: cuiNumber,
        relevamiento_id: relevamientoId,
        numero_construccion: numeroConstruccion,
        local_sin_uso: local.local_sin_uso === "Si" ? "Si" : "No",
      }));

      await localesService.postLocales(localesConDatos);

      toast.success(
        editando
          ? "Locales actualizados correctamente"
          : "Construcción y locales guardados correctamente"
      );
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Hubo un error al guardar los datos");
    } finally {
      setIsSubmitting(false);
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
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 my-4 mx-4 rounded-2xl">
          Estás editando construcciones y locales ya existentes.
        </div>
      )}
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
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
                      ? "bg-custom text-white shadow font-semibold"
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
                        className="text-sm bg-custom hover:bg-custom/50 text-white rounded-lg px-4 py-2"
                      >
                        + Agregar local
                      </button>
                    </div>

                    {/* Mostrar tabla de locales */}
                    <ReusableTable
                      data={localesPorConstruccion[activeIndex] || []}
                      columns={[
                        {
                          Header: "ID Plano",
                          accessor: "identificacion_plano",
                          Cell: ({ row }) => (
                            <input
                              type="number"
                              value={
                                localesPorConstruccion[activeIndex][row.index]
                                  .identificacion_plano
                              }
                              onChange={(e) => {
                                const newValue =
                                  parseInt(e.target.value, 10) || 0;
                                const updatedLocales = [
                                  ...localesPorConstruccion[activeIndex],
                                ];
                                updatedLocales[row.index] = {
                                  ...updatedLocales[row.index],
                                  identificacion_plano: newValue,
                                };
                                setLocalesPorConstruccion((prev) => ({
                                  ...prev,
                                  [activeIndex]: updatedLocales,
                                }));
                              }}
                              className="border p-1 rounded w-full"
                            />
                          ),
                        },
                        {
                          Header: "N° Planta",
                          accessor: "numero_planta",
                          Cell: ({ row }) => (
                            <input
                              type="number"
                              value={
                                localesPorConstruccion[activeIndex][row.index]
                                  .numero_planta
                              }
                              onChange={(e) => {
                                const newValue =
                                  parseInt(e.target.value, 10) || 0;
                                const updatedLocales = [
                                  ...localesPorConstruccion[activeIndex],
                                ];
                                updatedLocales[row.index] = {
                                  ...updatedLocales[row.index],
                                  numero_planta: newValue,
                                };
                                setLocalesPorConstruccion((prev) => ({
                                  ...prev,
                                  [activeIndex]: updatedLocales,
                                }));
                              }}
                              className="border p-1 rounded w-full"
                            />
                          ),
                        },
                        {
                          Header: "Tipo",
                          accessor: "local_id",
                          Cell: ({ row }: { row: any }) => {
                            const localActual =
                              localesPorConstruccion[activeIndex][row.index];

                            return (
                              <Select
                                label=""
                                value={
                                  localActual.local_id
                                    ? localActual.local_id.toString()
                                    : ""
                                }
                                options={opcionesLocales.map((local) => ({
                                  value: local.id.toString(),
                                  label: `${local.id} - ${local.name}`,
                                }))}
                                onChange={(e) => {
                                  const selectedId = parseInt(
                                    e.target.value,
                                    10
                                  );
                                  const selected = opcionesLocales.find(
                                    (l) => l.id === selectedId
                                  );
                                  if (selected) {
                                    const updatedLocales = [
                                      ...localesPorConstruccion[activeIndex],
                                    ];
                                    updatedLocales[row.index] = {
                                      ...updatedLocales[row.index],
                                      local_id: selected.id,
                                      tipo: selected.name,
                                      nombre_local: selected.name,
                                    };
                                    setLocalesPorConstruccion((prev) => ({
                                      ...prev,
                                      [activeIndex]: updatedLocales,
                                    }));
                                  }
                                }}
                              />
                            );
                          },
                        },

                        {
                          Header: "Sin uso",
                          accessor: "local_sin_uso",
                          Cell: ({ row }) => {
                            const local =
                              localesPorConstruccion[activeIndex][row.index];
                            return (
                              <input
                                type="checkbox"
                                checked={local.local_sin_uso === "Si"}
                                onChange={(e) => {
                                  const updatedLocales = [
                                    ...localesPorConstruccion[activeIndex],
                                  ];
                                  updatedLocales[row.index] = {
                                    ...updatedLocales[row.index],
                                    local_sin_uso: e.target.checked
                                      ? "Si"
                                      : "No",
                                  };
                                  setLocalesPorConstruccion((prev) => ({
                                    ...prev,
                                    [activeIndex]: updatedLocales,
                                  }));
                                }}
                              />
                            );
                          },
                        },
                        {
                          Header: "Superficie",
                          accessor: "superficie",
                          Cell: ({ row }: { row: any }) => {
                            const [tempValue, setTempValue] = useState<
                              number | undefined
                            >(
                              localesPorConstruccion[activeIndex][row.index]
                                ?.superficie
                            );

                            useEffect(() => {
                              setTempValue(
                                localesPorConstruccion[activeIndex][row.index]
                                  ?.superficie
                              );
                            }, [
                              localesPorConstruccion,
                              activeIndex,
                              row.index,
                            ]);

                            return (
                              <DecimalNumericInput
                                value={tempValue}
                                onChange={(newValue) => {
                                  setTempValue(newValue); // Solo se actualiza el input local
                                }}
                                onBlur={() => {
                                  const updatedLocales = [
                                    ...localesPorConstruccion[activeIndex],
                                  ];
                                  updatedLocales[row.index] = {
                                    ...updatedLocales[row.index],
                                    superficie: tempValue ?? 0,
                                  };
                                  setLocalesPorConstruccion((prev) => ({
                                    ...prev,
                                    [activeIndex]: updatedLocales,
                                  }));

                                  recalcularSuperficies(updatedLocales);
                                }}
                              />
                            );
                          },
                        },
                        {
                          Header: "Tipo superficie",
                          accessor: "tipo_superficie",
                          Cell: ({ row }) => (
                            <select
                              value={
                                localesPorConstruccion[activeIndex][row.index]
                                  .tipo_superficie
                              }
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const updatedLocales = [
                                  ...localesPorConstruccion[activeIndex],
                                ];
                                updatedLocales[row.index] = {
                                  ...updatedLocales[row.index],
                                  tipo_superficie: newValue,
                                };
                                setLocalesPorConstruccion((prev) => ({
                                  ...prev,
                                  [activeIndex]: updatedLocales,
                                }));
                              }}
                              className="border p-1 rounded w-full"
                            >
                              <option value="Cubierta">Cubierta</option>
                              <option value="Semicubierta">Semicubierta</option>
                            </select>
                          ),
                        },
                        {
                          Header: "Acciones",
                          accessor: "acciones",
                          Cell: ({ row }) => (
                            <button
                              onClick={() =>
                                handleEliminarLocal(activeIndex, row.index)
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
            disabled={isSubmitting}
            className={`bg-green-600 text-white px-6 py-2 rounded-lg ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-800"
            }`}
          >
            {isSubmitting
              ? editando
                ? "Actualizando..."
                : "Guardando..."
              : editando
              ? "Actualizar locales por construcción"
              : "Guardar locales por construcción"}
          </button>
        </div>
      </div>
    </div>
  );
}
