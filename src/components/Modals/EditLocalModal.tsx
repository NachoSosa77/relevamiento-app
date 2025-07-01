/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalesConstruccion, TipoLocales } from "@/interfaces/Locales";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
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
}

export default function EditLocalModal({
  open,
  onClose,
  local,
  onSave,
  opcionesLocales,
}: Props) {
  const [editData, setEditData] = useState<LocalesConstruccion>(local);

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
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Editar Local
          </Dialog.Title>

          <div className="grid grid-cols-1 gap-4">
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
              onChange={(e) =>
                handleChange("tipo_superficie", e.target.value)
              }
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
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(editData);
                onClose();
              }}
              className="bg-custom text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
