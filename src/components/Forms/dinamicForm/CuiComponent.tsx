/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import NumericInput from "@/components/ui/NumericInput";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { useAppDispatch } from "@/redux/hooks";
import { setInstitucionSeleccionada } from "@/redux/slices/institucionSlice";
import { establecimientosService } from "@/services/Establecimientos/establecimientosService";
import { useEffect, useState } from "react";

interface CuiComponentProps {
  label: string;
  sublabel: string;
  isReadOnly: boolean;
  initialCui: number | undefined;
  onCuiInputChange: (cui: number | undefined) => void;
}

const CuiComponent: React.FC<CuiComponentProps> = ({
  label,
  sublabel,
  isReadOnly,
  initialCui,
  onCuiInputChange,
}) => {
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [instituciones, setInstituciones] = useState<InstitucionesData[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    InstitucionesData[]
  >([]);
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
          (inst) => {
            return inst.cui === inputValue;
          }
        );
        console.log(filtered);
        setFilteredInstitutions(filtered);
      }
    }
  }, [inputValue, instituciones, isReadOnly]);

  const handleChange = (newValue: number | undefined) => {
    setInputValue(newValue);
    onCuiInputChange(newValue);
  };

  const handleInstitutionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = Number(event.target.value);
    const selected = filteredInstitutions.find(
      (inst) => inst.id === selectedId
    );
    //console.log("selected?.id:", selected?.id); // Agrega este console.log
    dispatch(setInstitucionSeleccionada(selected?.id)); // Corrección aquí
  };

  useEffect(() => {
    if (initialCui !== null) {
      setInputValue(initialCui);
    } else {
      setInputValue(undefined);
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
            disabled={isReadOnly}
          />
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      {!isReadOnly && filteredInstitutions.length > 0 && (
        <select
          className="mt-2 p-2 border"
          onChange={handleInstitutionSelect}
        >
          <option value="">Selecciona una institución</option>
          {filteredInstitutions.map((inst) => (
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