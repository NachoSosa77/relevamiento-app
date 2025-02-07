// hooks/useFormData.ts

import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import { useCallback, useEffect, useState } from "react";

export type FormGenericData = {
  [key: string]: any;

};

interface UseFormDataProps {
  fields: apiFiels[];
  initialData?: FormGenericData;
  onSubmit: (data: FormGenericData) => Promise<void>;
}

const useFormData = ({ fields, initialData, onSubmit }: UseFormDataProps) => {
  const [formData, setFormData] = useState<FormGenericData>(initialData || {});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);


  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const validateForm = () => {
      const requiredFields = fields.filter((field) => field.required);
      for (const field of requiredFields) {
        const value = formData[field.name];
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return false;
        }
      }
      return true;
    };
    setIsFormValid(validateForm());
  }, [formData, fields]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;

      // Verifica si el target es un HTMLInputElement para acceder a 'checked'
      if (event.target instanceof HTMLInputElement && type === "checkbox") {
        const { checked } = event.target;
        setFormData((prevData) => {
          const currentValue = prevData[name] || [];
          if (checked) {
            return { ...prevData, [name]: [...currentValue, value] };
          } else {
            return {
              ...prevData,
              [name]: currentValue.filter((v: any) => v !== value),
            };
          }
        });
      } else {
        // Para los casos de HTMLSelectElement o cualquier otro tipo
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    },
    []
  );


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.files![0],
      }));
    }
  }, []);

  const setData = useCallback((name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleData = (name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Datos enviados", formData)
    if (isFormValid) {
      setSubmitLoading(true);
      try {
        await onSubmit(formData);
        setFormData({});
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  return {
    formData,
    isFormValid,
    submitLoading,
    handleChange,
    handleFileChange,
    setData,
    handleSubmit,
    handleData
  };
};

export default useFormData;
