"use client";

import { Input } from "@/components/ui/AlphanumericInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useFields from "@/hooks/form/useFields";
import useFormData, { FormGenericData } from "@/hooks/form/useFormData";
import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import { Member } from "@/interfaces/api.interfaces/ApiForms";
import React, { useEffect } from "react";
import AddressInput from "./AddressInput";
import CheckboxGroup from "./CheckboxGroup";
import DateInput from "./DateInput";
import FileInput from "./FileInput";
import SelectGeneric from "./SelectGeneric";
import { TextInput } from "./TextInput";

interface BuilderFormProps {
  config: Member;
  onSubmit: (data: FormGenericData) => Promise<void>;
  title?: string;
  subtitle?: string;
  initialData?: FormGenericData; // Propiedad para datos iniciales
}

const BuilderForm: React.FC<BuilderFormProps> = ({
  config,
  onSubmit,
  title,
  subtitle,
  initialData, // Recibimos datos iniciales
}) => {
  const { fields, loadingFields, fieldsError } = useFields(config);

  const {
    formData,
    isFormValid,
    submitLoading,
    handleChange,
    handleFileChange,
    setData,
    handleSubmit,
    handleData,
  } = useFormData({ fields, initialData, onSubmit });

  console.log('INICIAL DATA', initialData);

  // Actualiza los datos iniciales en formData cuando `initialData` cambie
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setData(key, value);
      });
    }
  }, [initialData, setData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLocationSelect = (addressData: any, name: string) => {
    handleData(name, addressData);
  };

  const renderField = React.useCallback(
    (field: apiFiels) => {
      const labelContent = (
        <span>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </span>
      );
    const value = formData[field.name] || ""; // Carga valor desde formData o vacío
    console.log("renderField", value)

      switch (field.type) {
        case "file":
          return (
            <FileInput
              key={field.id}
              field={field}
              setData={setData}
            />
          );
        case "select":
          return (
            <SelectGeneric
              key={field.id}
              field={field}
              formData={formData}
              setData={setData}
              fields={fields}
            />
          );
        case "date":
          return (
            <DateInput
              key={field.id}
              field={field}
              formData={formData}
              setData={setData}
            />
          );
        case "checkbox":
          return (
            <CheckboxGroup
              key={field.id}
              field={field}
              formData={formData}
              setData={setData}
              fields={fields}

            />
          );
        case "text":
          return (
            <TextInput
              key={field.id}
              field={field}
              formData={formData}
              setData={setData}
              handleChange={handleChange}
              fields={fields}
            ></TextInput>
          );
        case "address":
          return (
            <AddressInput
              key={field.id}
              onLocationSelect={handleLocationSelect}
              field={field}
              initialData={initialData}
            />
          );
        case "email":
        case "number":
        case "password":
          return (
            <div key={field.name} className="space-y-4">
              <div className="space-y-2" key={field.name}>
                <Label htmlFor={String(field.id)}>{labelContent}</Label>
                <Input
                  type={field.type}
                  id={String(field.id)}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={handleChange}
                  className="border border-gray-300"
                  required={field.required}
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    },
    [formData, handleChange, handleLocationSelect, initialData, setData]
  );

  if (loadingFields) {
    return <div>Cargando campos del formulario...</div>;
  }

  if (fieldsError) {
    return (
      <div className="text-red-500">
        Error al cargar los campos del formulario: {fieldsError.message}
      </div>
    );
  }

  return (
    <div className="pr-2 pl-2 pt-2">
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {config.groupfields ? (
          config.groupfields.map((group) => (
            <div key={group.groupName} className="space-y-2">
              <h2 className="text-lg font-semibold">{group.groupName}</h2>
              <p>{group.subtitle}</p>
              <p className="text-sm text-gray-500">{group.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields
                  .filter((field) => field.groupName === group.groupName)
                  .map((field) => renderField(field))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => renderField(field))}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`${!isFormValid || submitLoading
                ? "bg-disabled-option-color cursor-not-allowed"
                : config.submitButtonClassName
              }`}
            disabled={!isFormValid || submitLoading}
          >
            {submitLoading ? "Enviando..." : config.submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuilderForm;
