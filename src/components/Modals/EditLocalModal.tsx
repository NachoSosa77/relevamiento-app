/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalesConstruccion, TipoLocales } from "@/interfaces/Locales";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Check from "../ui/Checkbox";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import NumericInput from "../ui/NumericInput";
import Select from "../ui/SelectComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  local: LocalesConstruccion;
  onSave: (updated: LocalesConstruccion) => void;
  opcionesLocales: TipoLocales[];
  modoCompleto?: boolean; // Si es necesario para el modo completo
}

export default function EditLocalModal({
  open,
  onClose,
  local,
  onSave,
  opcionesLocales,
  modoCompleto = false,
}: Props) {
  const [editData, setEditData] = useState<LocalesConstruccion>(local);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditData(local);
  }, [local]);

  const handleChange = (field: keyof LocalesConstruccion, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Editar Local
          </Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <NumericInput
              label="Identificación en el plano"
              value={editData.identificacion_plano}
              onChange={(v) => handleChange("identificacion_plano", v)}
            />
            <NumericInput
              label="Número de planta"
              value={editData.numero_planta}
              onChange={(v) => handleChange("numero_planta", v)}
            />
            <Select
              label="Tipo de local"
              value={editData.local_id.toString()}
              onChange={(e) => {
                const id = parseInt(e.target.value, 10);
                const found = opcionesLocales.find((o) => o.id === id);
                if (found) {
                  handleChange("local_id", id);
                  handleChange("tipo", found.name);
                  handleChange("nombre_local", found.name);
                }
              }}
              options={opcionesLocales.map((o) => ({
                value: o.id.toString(),
                label: `${o.id} - ${o.name}`,
              }))}
            />
            <Select
              label="Tipo de superficie"
              value={editData.tipo_superficie}
              onChange={(e) => handleChange("tipo_superficie", e.target.value)}
              options={[
                { value: "Cubierta", label: "Cubierta" },
                { value: "Semicubierta", label: "Semicubierta" },
              ]}
            />
            <Check
              label="Local sin uso"
              checked={editData.local_sin_uso === "Si"}
              onChange={(v) => handleChange("local_sin_uso", v ? "Si" : "No")}
            />
            <DecimalNumericInput
              label="Superficie"
              value={editData.superficie ?? 0}
              onChange={(v) => handleChange("superficie", v)}
            />
            {modoCompleto && (
              <>
                <DecimalNumericInput
                  label="Largo predominante (m)"
                  value={editData.largo_predominante ?? 0}
                  onChange={(v) => handleChange("largo_predominante", v)}
                />
                <DecimalNumericInput
                  label="Ancho predominante (m)"
                  value={editData.ancho_predominante ?? 0}
                  onChange={(v) => handleChange("ancho_predominante", v)}
                />
                <DecimalNumericInput
                  label="Diámetro (m)"
                  value={editData.diametro ?? 0}
                  onChange={(v) => handleChange("diametro", v)}
                />
                <DecimalNumericInput
                  label="Altura máxima (m)"
                  value={editData.altura_maxima ?? 0}
                  onChange={(v) => handleChange("altura_maxima", v)}
                />
                <DecimalNumericInput
                  label="Altura mínima (m)"
                  value={editData.altura_minima ?? 0}
                  onChange={(v) => handleChange("altura_minima", v)}
                />
                <Select
                  label="Protección contra robo"
                  value={editData.proteccion_contra_robo || ""}
                  onChange={(e) =>
                    handleChange("proteccion_contra_robo", e.target.value)
                  }
                  options={[
                    { value: "Rejas", label: "Rejas" },
                    { value: "Metal desplegado", label: "Metal desplegado" },
                    { value: "Postigones", label: "Postigones" },
                    { value: "Alarma", label: "Alarma" },
                    { value: "Otro", label: "Alarma" },
                    { value: "Ninguno", label: "Ninguno" },
                  ]}
                />
                <Select
                  label="Destino original"
                  value={editData.destino_original || ""}
                  onChange={(e) =>
                    handleChange("destino_original", e.target.value)
                  }
                  options={[
                    { value: "Escuela", label: "Escuela" },
                    { value: "Vivienda", label: "Vivienda" },
                    { value: "Fábrica", label: "Fábrica" },
                    {
                      value: "Estación ferroviaria",
                      label: "Estación ferroviaria",
                    },
                    { value: "Hospital", label: "Hospital" },
                    { value: "Otro", label: "Otro" },
                  ]}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Observaciones
                  </label>
                  <textarea
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={editData.observaciones || ""}
                    onChange={(e) =>
                      handleChange("observaciones", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
  onClick={async () => {
    setLoading(true);
    try {
      await onSave(editData); // espera que se guarde
      toast.success("Actualizado correctamente"); // feedback opcional
      setTimeout(() => {
        onClose(); // cerramos con pequeña demora para que el usuario lo vea
      }, 600); // podés ajustar este delay
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }}
  className="bg-custom text-white px-4 py-2 rounded"
  disabled={loading}
>
  {loading ? "Guardando..." : "Guardar"}
</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
