"use client";

import React, { ReactNode, useState } from "react";

interface AccordionProps {
  children: ReactNode;
  className?: string;
  type?: "single" | "multiple"; // para abrir solo uno o varios
}

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

export const AccordionContext = React.createContext<AccordionContextType | null>(null);

export const Accordion = ({ children, className, type = "single" }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems(openItems[0] === value ? [] : [value]);
    } else {
      // multiple
      if (openItems.includes(value)) {
        setOpenItems(openItems.filter((item) => item !== value));
      } else {
        setOpenItems([...openItems, value]);
      }
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};
