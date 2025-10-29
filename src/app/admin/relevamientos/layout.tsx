'use client'

import Navbar from "@/components/NavBar/NavBar";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10">
      <Navbar />
      {children}
    </div>
  );
}
