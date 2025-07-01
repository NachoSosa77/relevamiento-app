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
import EditLocalModal from "../Modals/EditLocalModal";
import ReusableTable from "../Table/TableReutilizable";
import Check from "../ui/Checkbox";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import NumericInput from "../ui/NumericInput";
import Select from "../ui/SelectComponent";

export default function LocalesPorConstruccion() {
  const [construccionIdEnProceso, setConstruccionIdEnProceso] = useState<
    Record<number, number | null>
  >({});
  
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
  const [modalOpen, setModalOpen] = useState(false);
  const [localEnEdicion, setLocalEnEdicion] =
    useState<LocalesConstruccion | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    if (isSubmitting || construccionIdEnProceso[activeIndex]) {
      console.warn("Ya hay un submit en proceso para este tab.");
      return;
    }

    setIsSubmitting(true);
    setConstruccionIdEnProceso((prev) => ({
      ...prev,
      [activeIndex]: -1, // 👉 lo seteamos apenas empieza el proceso
    }));

    try {
      const locales = localesPorConstruccion[activeIndex] || [];
      if (locales.length === 0) {
        toast.warning("Debe agregar al menos un local.");
        return;
      }

      const numeroConstruccion = activeIndex + 1;
      let construccionId: number | undefined;

      if (editando && construccionesExistentes[activeIndex]) {
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
        try {
          const construccion = await localesService.postConstrucciones({
            numero_construccion: numeroConstruccion,
            relevamiento_id: relevamientoId,
            superficie_cubierta:
              superficiesPorConstruccion[activeIndex]?.cubierta || 0,
            superficie_semicubierta:
              superficiesPorConstruccion[activeIndex]?.semicubierta || 0,
            superficie_total:
              superficiesPorConstruccion[activeIndex]?.total || 0,
          });

          construccionId = construccion.construccion_id;

          setConstruccionesExistentes((prev) => ({
            ...prev,
            [activeIndex]: construccionId,
          }));
          setEditando(true);
        } catch (err: any) {
          if (err?.response?.status === 409) {
            toast.error(
              "Ya existe una construcción con ese número para este relevamiento."
            );
          } else {
            toast.error("Error al crear la construcción.");
            console.error("Error inesperado:", err);
          }

          setIsSubmitting(false);
          setConstruccionIdEnProceso((prev) => ({
            ...prev,
            [activeIndex]: null,
          }));
          return; // 👈 cortamos ejecución si falló
        }
      }

      if (!construccionId || !relevamientoId || !cuiNumber) {
        toast.error("Faltan datos obligatorios para guardar los locales.");
        return;
      }

      setConstruccionIdEnProceso((prev) => ({
        ...prev,
        [activeIndex]: construccionId, // ✅ reemplazamos el -1 con el ID real
      }));

      const localesConDatos = locales.map((local) => ({
        ...local,
        construccion_id: construccionId!,
        cui_number: cuiNumber,
        relevamiento_id: relevamientoId!,
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
      setConstruccionIdEnProceso((prev) => ({
        ...prev,
        [activeIndex]: null,
      }));
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

  const algunaOtraTabEnProceso = Object.entries(construccionIdEnProceso).some(
    ([idx, val]) => parseInt(idx) !== activeIndex && val === -1
  );

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
            {Array.from({ length: cantidadConstrucciones }).map((_, idx) => {
              const enProceso = construccionIdEnProceso[idx] === -1;
              return (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    clsx(
                      "relative px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-300",
                      selected
                        ? "bg-custom text-white shadow font-semibold"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )
                  }
                >
                  Construcción {idx + 1}
                  {enProceso && (
                    <span className="absolute top-0 right-0 mt-1 mr-1 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  )}
                </Tab>
              );
            })}
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
                      data={localesPorConstruccion[idx] || []}
                      columns={[
                        {
                          Header: "ID Plano",
                          accessor: "identificacion_plano",
                        },
                        { Header: "N° Planta", accessor: "numero_planta" },
                        {
                          Header: "Tipo",
                          accessor: "tipo",
                          Cell: ({ row }) => {
                            const local =
                              localesPorConstruccion[activeIndex][row.index];
                            return (
                              <span>{local.nombre_local ?? local.tipo}</span>
                            );
                          },
                        },
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
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleEliminarLocal(activeIndex, row.index)
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => {
                                  const local =
                                    localesPorConstruccion[activeIndex][
                                      row.index
                                    ];
                                  setLocalEnEdicion(local);
                                  setEditingIndex(row.index);
                                  setModalOpen(true);
                                }}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Editar
                              </button>
                            </div>
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

        {localEnEdicion && (
          <EditLocalModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            local={localEnEdicion}
            opcionesLocales={opcionesLocales}
            onSave={(updated) => {
              const nuevos = [...localesPorConstruccion[activeIndex]];
              if (editingIndex !== null) {
                nuevos[editingIndex] = updated;
                setLocalesPorConstruccion((prev) => ({
                  ...prev,
                  [activeIndex]: nuevos,
                }));
              }
            }}
          />
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || algunaOtraTabEnProceso}
            className={clsx(
              "px-6 py-2 rounded-lg text-white",
              isSubmitting || algunaOtraTabEnProceso
                ? "bg-green-400 cursor-not-allowed opacity-60"
                : "bg-green-600 hover:bg-green-800"
            )}
          >
            {isSubmitting
              ? "Guardando..."
              : algunaOtraTabEnProceso
              ? "Espere, hay otra pestaña guardando..."
              : editando
              ? "Actualizar locales por construcción"
              : "Guardar locales por construcción"}
          </button>
        </div>
      </div>
    </div>
  );
}
