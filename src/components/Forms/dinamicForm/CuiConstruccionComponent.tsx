 
"use client";
import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
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
                value={initialCui}
                onChange={()=>{}}
                disabled={isReadOnly} // Deshabilita el input si es de solo lectura
            />
            </div>
            <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">
                N° DE CONSTRUCCIÓN
            </p>
            </div>
            <div className="ml-auto">
            <NumericInput
                subLabel=""
                label={""}
                value={0}
                onChange={()=>{}}
                disabled={isReadOnly} // Deshabilita el input si es de solo lectura
            />
            </div>
        </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-xs text-gray-400">
          {sublabel}
        </p>
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
                <p>Transcriba del Fórmulario 1 la denominación de los establecimientos educativos que funcionan en la construcción y el Número de CUE-Anexo de cada uno de ellos.</p>
            </div>
            <div>
                <EstablecimientosEducativos selectedInstitutions={selectedInstitutions}/>
            </div>
        </div>
      )}
    </div>
  );
};

export default CuiConstruccionComponent;
