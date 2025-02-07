import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface TextInputProps {
  label: string;
  subLabel: string;
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
}) => {
  return (
    <div className="mt-4 text-sm">
      <Textarea
        placeholder={"Escriba aquí sus observaciones"}
        className="p-2 border border-gray-300 w-full"
      />
    </div>
  );
};

export default TextInput;
