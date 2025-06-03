"use client"; // app/(tu-ruta)/espacios-escolares/layout.tsx
import Navbar from "@/components/NavBar/NavBar";
import { ReactNode } from "react";

export default function RelevamientoPredioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-10">
      <Navbar />

      {children}
    </div>
  );
}
