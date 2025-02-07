import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import React from "react";

interface DateInputProps {
  field: apiFiels;
  formData: { [key: string]: any };
  setData: (name: string, value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ field, formData, setData }) => {
  //console.log('nachooooo',formData);
  //console.log('fielddddd',field);
  return (
    <div key={field.name} className="space-y-4">
      <div className="space-y-2" key={field.name}>
        <Label htmlFor={"" + field.id}>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full justify-start text-left font-normal"></Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"></PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateInput;
