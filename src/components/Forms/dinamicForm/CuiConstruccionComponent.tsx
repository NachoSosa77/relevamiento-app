"use client";
import NumericInput from "@/components/ui/NumericInput";
import Spinner from "@/components/ui/Spinner";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EstablecimientosEducativos from "../EstablecimientosEducativos";

interface Construccion {
  id: number;
  numero_construccion: number;
}

interface CuiComponentProps {
  label: string;
  sublabel: string;
  selectedInstitutions: InstitucionesData[] | null;
  isReadOnly: boolean;
  initialCui: number | undefined;
  onCuiInputChange: (cui: number | null) => void;
  setConstruccionId: (id: number | null) => void;
}

const CuiConstruccionComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
  selectedInstitutions,
  isReadOnly,
  initialCui,
  setConstruccionId,
}) => {
  const relevamientoId = useRelevamientoId();
  const [isLoading, setIsLoading] = useState(true);
  const [construcciones, setConstrucciones] = useState<Construccion[]>([]);
  const [selectedConstruccionId, setSelectedConstruccionId] = useState<
    number | null
  >(null);
  const [numeroConstruccion, setNumeroConstruccion] = useState<number>(0);

  useEffect(() => {
    if (!relevamientoId) {
      setConstrucciones([]);
      setSelectedConstruccionId(null);
      setNumeroConstruccion(0);
      setConstruccionId(null);
      setIsLoading(false);
      return;
    }

    fetch(`/api/construcciones?relevamiento_id=${relevamientoId}`)
      .then((res) => res.json())
      .then((data: Construccion[]) => {
        setConstrucciones(data);

        if (data.length > 0 && selectedConstruccionId === null) {
          setSelectedConstruccionId(data[0].id);
          setNumeroConstruccion(data[0].numero_construccion);
          setConstruccionId(data[0].id);
        } else if (data.length === 0) {
          setSelectedConstruccionId(null);
          setNumeroConstruccion(0);
          setConstruccionId(null);
        }
      })
      .catch(() => {
        toast.error("Error al cargar construcciones");
         setIsLoading(false);
      });
  }, [relevamientoId, setConstruccionId, selectedConstruccionId]);


  // Cuando cambie la construcción seleccionada vía tab
  const handleTabClick = (id: number, numero: number) => {
    setSelectedConstruccionId(id);
    setConstruccionId(id);
    setNumeroConstruccion(numero);
  };

  return (
    <div className="mx-10 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      <p className="text-sm">{label}</p>
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Construcciones existentes
        </label>
        <p className="text-gray-600 mb-2">
          Seleccione una de las construcciones disponibles para comenzar el
          relevamiento. Si hay más de una, deberá completar un relevamiento para
          cada una por separado.
        </p>

 {isLoading ? (
  <div className="flex justify-center items-center py-4">
    <Spinner />
  </div>
) : construcciones.length === 0 ? (
  <p className="text-black">No hay construcciones</p>
) : (
  <div className="border-b border-gray-300 mb-4">
    <nav className="-mb-px flex space-x-4 overflow-x-auto">
      {construcciones.map((c) => (
        <button
          key={c.id}
          onClick={() => handleTabClick(c.id, c.numero_construccion)}
          disabled={isReadOnly}
          className={
            "whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm " +
            (selectedConstruccionId === c.id
              ? "border-custom text-custom"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")
          }
        >
          Construcción Nº {c.numero_construccion}
        </button>
      ))}
    </nav>
  </div>
)}

      </div>

      <div className="flex items-center justify-between gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>A</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">
            CUI (Código Único de Infraestructura)
          </p>
        </div>
        <div className="ml-auto">
          <NumericInput
            subLabel=""
            label=""
            value={initialCui ?? 0}
            onChange={() => {}}
            disabled={isReadOnly}
          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° de construcción</p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-2">
          <NumericInput
            subLabel=""
            label=""
            value={numeroConstruccion}
            disabled={true}
            onChange={(value) => {
              if (typeof value === "number") {
                setNumeroConstruccion(value);
                setSelectedConstruccionId(null);
                setConstruccionId(null);
              }
            }}
          />
        </div>
        <div className="flex p-1 bg-gray-100 border">
          <p className="text-xs text-gray-400">{sublabel}</p>
        </div>
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
