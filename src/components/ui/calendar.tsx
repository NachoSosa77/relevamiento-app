"use client"

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        month_caption: "flex justify-center items-start",
        dropdowns: "flex items-center justify-center",
        dropdown: "font-bold justify-between items-start border-b-2 border-gray-300 mb-4",
        weekdays: "text-center text-sm font-bold uppercase bg-white text-blue-500 pt-2",
        caption_label: "text-white",
        day: "text-center p-2",
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar };

