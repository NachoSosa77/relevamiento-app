/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreasExteriores } from "@/interfaces/AreaExterior";
import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import AlphanumericInput from "../ui/AlphanumericInput";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import Select from "../ui/SelectComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  area: AreasExteriores;
  onSave: (updated: AreasExteriores) => void;
  opcionesAreas: TipoAreasExteriores[];
}

export default function EditAreaExteriorModal({
  open,
  onClose,
  area,
  onSave,
  opcionesAreas,
}: Props) {
  const [editData, setEditData] = useState<AreasExteriores>(area);

  useEffect(() => {
    setEditData(area);
  }, [area]);

  const handleChange = (field: keyof AreasExteriores, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Editar Área Exterior
          </Dialog.Title>

          <div className="grid grid-cols-1 gap-4">
            <AlphanumericInput
              disabled={false}
              label="Identificación en el plano"
              subLabel="E"
              value={editData.identificacion_plano}
              onChange={(val) =>
                handleChange("identificacion_plano", Number(val))
              }
            />

            <Select
              label="Tipo"
              value={
                opcionesAreas.find((t) => t.name === editData.tipo)?.id.toString() || ""
              }
              options={opcionesAreas.map((op) => ({
                value: op.id.toString(),
                label: `${op.prefijo} - ${op.name}`,
              }))}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value, 10);
                const selectedTipo = opcionesAreas.find((o) => o.id === selectedId);
                if (selectedTipo) {
                  handleChange("tipo", selectedTipo.name);
                }
              }}
            />

            <DecimalNumericInput
              label="Superficie"
              subLabel="m²"
              value={editData.superficie}
              onChange={(val) => handleChange("superficie", Number(val))}
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
