import { Input } from "@/components/ui/AlphanumericInput";
import { Label } from "@/components/ui/label";
import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import React from "react";

interface FileInputProps {
  field: apiFiels;
  setData: (name: string, value: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ field, setData }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setData(field.name, event.target.files[0]);
    } else {
      setData(field.name, null); // Limpia el archivo si no hay uno seleccionado
    }
  };

  return (
    <React.Fragment key={field.name}>
    <div className="space-y-4"> 
      <div className="space-y-2" key={field.name}>
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </Label>
        <Input
          type="file"
          id={field.id.toString()}
          name={field.name}
          onChange={handleFileChange}
          className="border border-gray-300"
          required={field.required}
        />
      </div>
    </div>
    <div className="space-y-4"></div> 
  </React.Fragment>
  
  );
};

export default FileInput;
