/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService";
import { useEffect, useState } from "react";

interface CuiComponentProps {
  label: string;
  selectedInstitution: InstitucionesData | null; // Nueva prop para la institución seleccionada
  onInstitutionSelected: (institution: InstitucionesData | null) => void;
  isReadOnly: boolean;
  initialCui: number | null; // Añade la propiedad initialCui
  onCuiInputChange: (cui: number | null) => void; // Añade la función onCuiInputChange
}

const CuiComponent: React.FC<CuiComponentProps> = ({
  label,
  selectedInstitution,
  onInstitutionSelected,
  isReadOnly,
  initialCui,
  onCuiInputChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    InstitucionesData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await establecimientosService.getAllEstablecimientos();
        console.log('data response',response.instituciones)
        if (response && Array.isArray(response.instituciones)) {
          setInstituciones(response.instituciones);
        } else {
          setInstituciones([]);
        }
      } catch (error: any) {
        setError(error?.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isReadOnly) {
      fetchInstituciones();
    }
  }, [isReadOnly]);

  useEffect(() => {
    if (!isReadOnly) {
      if (inputValue === "") {
        setFilteredInstitutions([]);
      } else {
        const filtered = instituciones.filter(
          (inst) => String(inst.cui) === inputValue
        );
        setFilteredInstitutions(filtered);
      }
    }
  }, [inputValue, instituciones, isReadOnly]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    onCuiInputChange(Number(newValue));
  };

  const handleInstitutionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCueString = event.target.value;
    const selectedCueNumber = Number(selectedCueString); // Convierte a número
    const selected = filteredInstitutions.find(
      (inst) => inst.cue === selectedCueNumber
    );
    onInstitutionSelected(selected || null);
  };

  useEffect(() => {
    if (initialCui !== null) {
      setInputValue(initialCui.toString());
    } else {
      setInputValue("");
    }
  }, [initialCui]);

  if (loading && !isReadOnly) {
    return <div>Cargando instituciones...</div>;
  }

  if (error && !isReadOnly) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-10">
      <p className="text-sm">{label}</p>
      <div className="flex mt-2 p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>A</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            CUI (Código Único de Infraestructura)
          </p>
        </div>
        <div className="ml-auto">
          <NumericInput
            subLabel=""
            label={""}
            value={inputValue}
            onChange={handleChange}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura
          />
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta el Número de CUI
        </p>
      </div>
      {/* Muestra las instituciones encontradas */}
      {!isReadOnly &&
        filteredInstitutions.length > 0 && ( // Select solo si no es de solo lectura y hay resultados
          <select
            className="mt-2 p-2 border"
            value={selectedInstitution?.cue || ""}
            onChange={handleInstitutionSelect}
          >
            <option value="">Selecciona una institución</option>
            {filteredInstitutions.map((inst) => (
              <option key={inst.cue} value={inst.cue}>
                {inst.institucion} ({inst.modalidad_nivel})
              </option>
            ))}
          </select>
        )}

      {selectedInstitution && isReadOnly && (
        <div className="mt-2 p-2 border flex justify-between items-center text-sm font-bold">
          <p>Institución: <span className="font-normal">{selectedInstitution.institucion}</span></p>
          <p>CUE: <span className="font-normal">{selectedInstitution.cue}</span></p>
          <p>CUI: <span className="font-normal">{selectedInstitution.cui}</span></p>
        </div>
      )}
    </div>
  );
};

export default CuiComponent;
