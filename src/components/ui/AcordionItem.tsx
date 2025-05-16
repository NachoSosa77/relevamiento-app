"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReactNode, useContext } from "react";
import { AccordionContext } from "./Acordion";

interface AccordionItemProps {
  value: string;
  title: string;
  children: ReactNode;
}

export const AccordionItem = ({ value, title, children }: AccordionItemProps) => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem debe estar dentro de un Accordion");
  }

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(value);

  return (
    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => toggleItem(value)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-base font-medium text-gray-800">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="px-6 pb-4 text-sm text-gray-700 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
