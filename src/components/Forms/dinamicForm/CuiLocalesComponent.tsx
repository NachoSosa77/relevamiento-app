/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AlphanumericInput from "@/components/ui/AlphanumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService";
import { useEffect, useState } from "react";


interface CuiComponentProps {
  label: string;
  sublabel: string;
  selectedInstitution: InstitucionesData | null; // Nueva prop para la institución seleccionada
  onInstitutionSelected: (institution: InstitucionesData | null) => void;
  isReadOnly: boolean;
  initialCui: number | null; // Añade la propiedad initialCui
  onCuiInputChange: (cui: number | null) => void; // Añade la función onCuiInputChange
}

const CuiLocalesComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
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
        console.log("data response", response.instituciones);
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
      <div className="flex items-center justify-between gap-2 mt-2 p-2 border">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>A</p>
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">CUI</p>
        </div>
        <div className="ml-auto">
          <AlphanumericInput
            subLabel=""
            label={""}
            value={inputValue}
            onChange={handleChange}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura

          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° DE CONSTRUCCIÓN</p>
        </div>
        <div className="ml-auto">
          <AlphanumericInput
            subLabel=""
            label={""}
            value="1"
            onChange={handleChange}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura
          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° PLANTA</p>
        </div>
        <div className="ml-auto">
          <AlphanumericInput
            subLabel=""
            label={""}
            value="1"
            onChange={handleChange}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura
          />
        </div>
        <div className="h-6 flex items-center justify-center ">
          <p className="px-2 text-sm font-bold">N° DE LOCAL</p>
        </div>
        <div className="ml-auto">
          <AlphanumericInput
            subLabel=""
            label={""}
            value="1"
            onChange={handleChange}
            disabled={isReadOnly} // Deshabilita el input si es de solo lectura
          />
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-xs text-gray-400">{sublabel}</p>
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
    </div>
  );
};

export default CuiLocalesComponent;
