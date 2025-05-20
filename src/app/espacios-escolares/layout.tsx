// app/(tu-ruta)/espacios-escolares/layout.tsx
import { ReactNode } from "react";

export default function EspaciosEscolaresLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10">
      {children}
    </div>
  );
}
