// components/SelectGeneric.tsx

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectComponent";
import { Option, resultObject, SelectGenericProps } from "@/interfaces/formComponents.interfaces/selectData";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

const SelectGeneric: React.FC<SelectGenericProps> = ({
  field,
  formData,
  setData,
  fields,
}) => {
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
          //console.log('matches', matches);
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
        //console.log('matches', matches);
        setIsVisible(matches);
      } else {
        setIsVisible(true);
      }

      if (field.getOptionsUrl) {
        setLoadingOptions(true);
        setError(null);

        try {
          let getUrl = field.getOptionsUrl;
          console.log('GETURL', getUrl)

          // Añadir filtro basado en el valor del campo padre
          if (field.fatherValue && fatherFieldValue) {

            const separator = getUrl.includes("?") ? "&" : "?";
            getUrl += `${separator}${field.father}=${fatherFieldValue}`;
          }

          //console.log("ulr", getUrl)

          const response = await axiosInstance.get(getUrl);
          const result: resultObject = response.data;

          const newOptions = result.member.map((option) => ({
            label:
              option.nombre ||
              option.Descripcion ||
              option.name ||
              option.descripcion ||
              option.codigo ||
              option.sector ||
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

  // Limpiar el valor del campo si el padre cambia y no tiene valor
  useEffect(() => {
    if (field.fatherValue && !fatherFieldValue) {
      if (formData[field.name] !== "") {
        setData(field.name, "");
      }
    }
  }, [fatherFieldValue, field.fatherValue, formData, field.name, setData]);

  //console.log("Form data", formData[field.name])

  const labelContent = (
    <span>
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </span>
  );

  return (
    <div
      key={field.name}
      className="space-y-4"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <div className="space-y-2">
        <Label htmlFor={field.name}>{labelContent}</Label>
        {field.fatherValue && !fatherFieldValue ? (
          <div>Por favor, selecciona primero {fatherField?.label}</div>
        ) : (
          <>
            <Select
              name={field.name}
              onValueChange={(value) => setData(field.name, value)}
              value={formData[field.name] || ""}
              disabled={isValueBlocked}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {loadingOptions ? (
                  <SelectItem value="loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>
                    No hay opciones disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {error && <div className="text-red-500">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectGeneric;
