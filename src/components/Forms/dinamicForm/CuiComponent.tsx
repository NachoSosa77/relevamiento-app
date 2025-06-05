/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch } from "@/redux/hooks";
import { setCui } from "@/redux/slices/espacioEscolarSlice";
import { setInstitucionSeleccionada } from "@/redux/slices/institucionSlice";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService";
import { useEffect, useState } from "react";

interface CuiComponentProps {
  label: string;
  sublabel: string;
  isReadOnly: boolean;
  initialCui: number | undefined;
  onCuiInputChange: (cui: number | undefined) => void;
  institucionActualId?: number; // 👈 nueva prop para ocultar institución seleccionada
}

const CuiComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
  isReadOnly,
  initialCui,
  onCuiInputChange,
  institucionActualId,
}) => {
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    InstitucionesData[]
  >([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await establecimientosService.getAllEstablecimientos();
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
      if (inputValue === undefined) {
        setFilteredInstitutions([]);
      } else {
        const filtered = instituciones.filter(
          (inst) => inst.cui === inputValue
        );
        setFilteredInstitutions(filtered);
      }
    }
  }, [inputValue, instituciones, isReadOnly]);

  const handleChange = (newValue: number | undefined) => {
    setInputValue(newValue);
    onCuiInputChange(newValue);
    dispatch(setCui(newValue));
  };

  const handleInstitutionSelect = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  const id = Number(event.target.value);
  setSelectedInstitutionId(id);
  
  const selected = filteredInstitutions.find((inst) => inst.id === id);
  if (selected) {
    dispatch(setInstitucionSeleccionada(selected.id));
  }
};




  useEffect(() => {
    if (initialCui !== null) {
      setInputValue(initialCui);
    } else {
      setInputValue(undefined);
    }
  }, [initialCui]);

  if (error && !isReadOnly) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-10">
      <p className="text-sm">{label}</p>
      <div className="flex mt-2 p-2 border items-center rounded-2xl shadow-lg bg-white text-black">
        <div className="w-6 h-6 flex justify-center items-center bg-custom rounded-full text-white">
          <p>A</p>
        </div>
        <div>
          <p className="text-sm font-bold ml-4">
            CUI (Código Único de Infraestructura)
          </p>
        </div>
        <div className="ml-auto flex items-center">
          <p className="text-sm font-bold mr-4">Ingresa el número de CUI:</p>
          <NumericInput
            subLabel=""
            label=""
            value={inputValue}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border rounded-lg">
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      {!isReadOnly && filteredInstitutions.length > 0 && (
          <select
            className="mt-2 p-2 border rounded-lg"
            onChange={handleInstitutionSelect}
            value={selectedInstitutionId ?? ""}
          >
            <option value="">Selecciona una institución</option>
            {filteredInstitutions
              .filter((inst) => inst.id !== institucionActualId) // 👈 oculta la ya seleccionada
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.institucion} ({inst.modalidad_nivel})
                </option>
              ))}
          </select>
      )}
    </div>
  );
};

export default CuiComponent;
