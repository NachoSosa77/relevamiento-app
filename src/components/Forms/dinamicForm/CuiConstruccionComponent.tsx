"use client";
import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify"; // Importa el toast
import EstablecimientosEducativos from "../EstablecimientosEducativos";

interface CuiComponentProps {
  label: string;
  sublabel: string;
  selectedInstitutions: InstitucionesData[] | null; // Nueva prop para la institución seleccionada
  isReadOnly: boolean;
  initialCui: number | undefined; // Añade la propiedad initialCui
  onCuiInputChange: (cui: number | null) => void; // Añade la función onCuiInputChange
}

const CuiConstruccionComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
  selectedInstitutions,
  isReadOnly,
  initialCui,
}) => {
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );
  const [numeroConstruccion, setNumeroConstruccion] = useState<number>(0);

  return (
    <div className="mx-10">
      <p className="text-sm">{label}</p>
      <div className="flex items-center justify-between gap-2 mt-2 p-2 border">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>A</p>
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">
            CUI (Código Único de Infraestructura)
          </p>
        </div>
        <div className="ml-auto">
          <NumericInput
            subLabel=""
            label={""}
            value={initialCui ?? 0} // Usa el valor inicial del CUI
            onChange={() => {}}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura
          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° DE CONSTRUCCIÓN</p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-2">
          <NumericInput
            subLabel=""
            label={""}
            value={numeroConstruccion}
            onChange={(value) => {
              if (typeof value === "number") {
                setNumeroConstruccion(value);
              }
            }}
            disabled={false} // Deshabilita el input si es de solo lectura
          />
          <div className="mt-2 flex justify-end">
            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                numeroConstruccion === 0 ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
              disabled={numeroConstruccion === 0} // Deshabilitado si el número de construcción es 0
              onClick={() => {
                console.log("numeroConstruccion:", numeroConstruccion);
                console.log("relevamientoId:", relevamientoId);
                console.log("selectedInstitutions:", selectedInstitutions);
                if (
                  numeroConstruccion > 0 &&
                  relevamientoId &&
                  selectedInstitutions
                ) {
                  toast.success("Número de construcción cargado exitosamente!");
                  console.log("Número de construcción:", numeroConstruccion);
                } else {
                  toast.warn("Faltan datos requeridos");
                }
              }}
            >
              Confirmar Construcción
            </button>
          </div>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      {selectedInstitutions && isReadOnly && (
        <div>
          <div className="flex items-center gap-2 mt-2 p-2 border">
            <div className="w-6 h-6 flex justify-center text-white bg-black">
              <p>B</p>
            </div>
            <div className="h-6 flex items-center justify-center">
              <p className="px-2 text-sm font-bold">
                ESTABLECIMIENTOS EDUCATIVOS
              </p>
            </div>
          </div>
          <div className="flex items-center p-1 border bg-slate-200 text-slate-400 text-xs">
            <p>
              Transcriba del Fórmulario 1 la denominación de los
              establecimientos educativos que funcionan en la construcción y el
              Número de CUE-Anexo de cada uno de ellos.
            </p>
          </div>
          <div>
            <EstablecimientosEducativos
              selectedInstitutions={selectedInstitutions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CuiConstruccionComponent;
