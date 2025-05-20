"use client";
import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Importa el toast
import EstablecimientosEducativos from "../EstablecimientosEducativos";

interface Construccion {
  id: number;
  numero_construccion: number;
  // otros campos si hay
}

interface CuiComponentProps {
  label: string;
  sublabel: string;
  selectedInstitutions: InstitucionesData[] | null;
  isReadOnly: boolean;
  initialCui: number | undefined;
  onCuiInputChange: (cui: number | null) => void;
  setConstruccionId: (id: number | null) => void; // Cambié para aceptar null también
}

const CuiConstruccionComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
  selectedInstitutions,
  isReadOnly,
  initialCui,
  setConstruccionId,
}) => {
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const [construcciones, setConstrucciones] = useState<Construccion[]>([]);
  const [selectedConstruccionId, setSelectedConstruccionId] = useState<number | null>(null);
  const [numeroConstruccion, setNumeroConstruccion] = useState<number>(0);

  useEffect(() => {
    if (!relevamientoId) {
      setConstrucciones([]);
      setSelectedConstruccionId(null);
      setNumeroConstruccion(0);
      setConstruccionId(null); // informar al padre
      return;
    }

    fetch(`/api/construcciones?relevamiento_id=${relevamientoId}`)
      .then((res) => res.json())
      .then((data: Construccion[]) => {
        setConstrucciones(data);
        if (data.length > 0) {
          setSelectedConstruccionId(data[0].id);
          setNumeroConstruccion(data[0].numero_construccion);
          setConstruccionId(data[0].id); // informar al padre
        } else {
          setSelectedConstruccionId(null);
          setNumeroConstruccion(0);
          setConstruccionId(null); // informar al padre
        }
      })
      .catch(() => {
        toast.error("Error al cargar construcciones");
      });
  }, [relevamientoId, setConstruccionId]);

  const handleConstruccionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedConstruccionId(id);
    setConstruccionId(id); // informar al padre

    const construccion = construcciones.find((c) => c.id === id);
    if (construccion) {
      setNumeroConstruccion(construccion.numero_construccion);
    }
  };

  return (
    <div className="mx-10">
      <p className="text-sm">{label}</p>

      {/* Dropdown para seleccionar construcción existente */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Construcciones existentes</label>
        <select
          value={selectedConstruccionId ?? ""}
          onChange={handleConstruccionChange}
          disabled={isReadOnly || construcciones.length === 0}
          className="border border-gray-300 rounded p-2 w-full"
        >
          {construcciones.length === 0 && <option value="">No hay construcciones</option>}
          {construcciones.map((c) => (
            <option key={c.id} value={c.id}>
              Construcción Nº {c.numero_construccion}
            </option>
          ))}
        </select>
      </div>

      {/* Input para crear nueva o modificar número */}
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
            label=""
            value={initialCui ?? 0}
            onChange={() => {}}
            disabled={isReadOnly}
          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° DE CONSTRUCCIÓN</p>
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
                setSelectedConstruccionId(null); // si cambia número manualmente, no está seleccionando uno existente
                setConstruccionId(null); // informar al padre que no hay construcción seleccionada
              }
            }}
          />
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
              <p className="px-2 text-sm font-bold">ESTABLECIMIENTOS EDUCATIVOS</p>
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
            <EstablecimientosEducativos selectedInstitutions={selectedInstitutions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CuiConstruccionComponent;
