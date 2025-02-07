
import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";

import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import axiosInstance from "@/utils/axiosInstance";

interface CheckboxGroupProps {
  field: apiFiels;
  formData: { [key: string]: any };
  setData: (name: string, value: any) => void;
  fields: apiFiels[]; // Añadimos fields como prop
}

interface Option {
  label: string;
  value: string;
}

interface resultObject {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: Member[];
}

interface Member {
  "@id": string;
  "@type": string;
  id: number;
  nombre?: string;
  name?: string;
  denominacionDeVehiculo?: string;
  codigo?: string;
  descripcion?: string;
  marca?: string;
  Descripcion?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ field, formData, setData, fields  }) => {
  
  const [options, setOptions] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fatherFieldValue, setFatherFieldValue] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isValueBlocked, setIsValueBlocked] = useState<boolean>(false);

  // Encontrar el campo padre usando el ID proporcionado en fatherValue
  const fatherField = field.fatherValue
    ? fields.find((f) => f.id === field.fatherValue)
    : null;

  // Actualizar el valor del campo padre cuando formData cambie
  useEffect(() => {
    setFatherFieldValue(fatherField ? formData[fatherField.name] : null);
  }, [formData, fatherField]);

  useEffect(() => {
    const fetchOptions = async () => {
      // Si el campo tiene un padre y no se ha seleccionado un valor
      if (field.fatherValue && !fatherFieldValue) {
        setOptions([]);
        if (formData[field.name] !== "") {
          setData(field.name, ""); // Limpiar el valor del campo actual
        }

        // Implementación de ifValueRender
        if (
          field.ifValueRender &&
          Array.isArray(field.ifValueRender) &&
          field.ifValueRender.length > 0
        ) {
          // Convertir fatherFieldValue a string para comparación
          const fatherValueStr =
            fatherFieldValue !== null && fatherFieldValue !== undefined
              ? +fatherFieldValue
              : null;
          const matches = field.ifValueRender.includes(fatherValueStr!);
          setIsVisible(matches);
          console.log('matches', matches);
        } else {
          setIsVisible(true);
        }

        return;
      }

    //  console.log('field.ifValueRender',field.ifValueRender)
    //  console.log('field.ifValueRender', field.ifValueRender?.length)
    //  console.log('fatherFieldValuefatherFieldValue', fatherFieldValue)
      if (
        field.ifValueRender &&
        Array.isArray(field.ifValueRender) &&
        field.ifValueRender.length > 0
      ) {
        const fatherValueStr =
          fatherFieldValue !== null && fatherFieldValue !== undefined
            ? +fatherFieldValue
            : null;
        const matches = field.ifValueRender.includes(fatherValueStr!);
        console.log('matches', matches);
        setIsVisible(matches);
      } else {
        setIsVisible(true);
      }

      if (field.getOptionsUrl) {
        setLoadingOptions(true);
        setError(null);

        try {
          let getUrl = field.getOptionsUrl;

          // Añadir filtro basado en el valor del campo padre
          if (field.fatherValue && fatherFieldValue) {
            const separator = getUrl.includes("?") ? "&" : "?";
            getUrl += `${separator}${field.father}=${fatherFieldValue}`;
          }

          const response = await axiosInstance.get(getUrl);
          const result: resultObject = response.data;

          const newOptions = result.member.map((option) => ({
            label:
              option.nombre ||
              option.Descripcion ||
              option.name ||
              option.descripcion ||
              option.codigo ||
              option.denominacionDeVehiculo ||
              option.marca ||
              "",
            value: option.id.toString(),
          }));
          setOptions(newOptions);

          // Implementación de valueBlock
          if (field.valueBlock !== undefined && field.valueBlock !== null) {
            const valueBlockStr = field.valueBlock.toString();
            const optionExists = newOptions.some(
              (opt) => opt.value === valueBlockStr
            );
            if (optionExists) {
              setIsValueBlocked(true);
              if (formData[field.name] !== valueBlockStr) {
                setData(field.name, valueBlockStr);
              }
            } else {
              setIsValueBlocked(false);
            }
          } else {
            setIsValueBlocked(false);
          }
        } catch (err) {
          console.error("Error fetching options: ", err);
          setError("Error al cargar las opciones.");
        } finally {
          setLoadingOptions(false);
        }
      } else if (field.options && field.options.length > 0) {
        // Usar opciones estáticas
        setOptions(field.options);

        // Implementación de valueBlock para opciones estáticas
        if (field.valueBlock !== undefined && field.valueBlock !== null) {
          const valueBlockStr = field.valueBlock.toString();
          const optionExists = field.options.some(
            (opt) => opt.value === valueBlockStr
          );
          if (optionExists) {
            setIsValueBlocked(true);
            if (formData[field.name] !== valueBlockStr) {
              setData(field.name, valueBlockStr);
            }
          } else {
            setIsValueBlocked(false);
          }
        } else {
          setIsValueBlocked(false);
        }
      } else {
        setOptions([]);
        setIsValueBlocked(false);
      }
    };

    fetchOptions();
  }, [field, fatherFieldValue, setData, formData]);


  const handleCheckboxChange = (checked: boolean, value: string) => {
    const updatedCheckboxes = formData[field.name] ? [...formData[field.name]] : [];

    if (checked) {
      updatedCheckboxes.push(value);
    } else {
      const index = updatedCheckboxes.indexOf(value);
      if (index > -1) {
        updatedCheckboxes.splice(index, 1);
      }
    }

    if (updatedCheckboxes.length === 1) {
      setData(field.name, updatedCheckboxes[0]);
    } else {
      setData(field.name, updatedCheckboxes);
    }
  };

  const labelContent = (
    <span>
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </span>
  );

  return (
    <React.Fragment key={field.name}>
      <div key={field.name} className="space-y-4 col-span-2">
        <div className="space-y-2" key={field.name}>
          <Label>
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <div className="space-y-2 grid grid-cols-1 md:grid-cols-4 gap-4" >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  name={field.name}
                  checked={formData[field.name]?.includes(option.value) || false}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange(checked, option.value)}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CheckboxGroup;
