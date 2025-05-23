// app/(tu-ruta)/espacios-escolares/layout.tsx
'use client'

import Navbar from "@/components/NavBar/NavBar";
import { ReactNode } from "react";

export default function RelevamientoLocalesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10">
      <Navbar />
      {children}
    </div>
  );
}
