/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Archivo {
  archivo_url: string;
  tipo_archivo: "imagen" | "pdf";
}

export const ArchivosDetalle = ({ relevamientoId }: { relevamientoId: number }) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const res = await fetch(`/api/archivos?relevamientoId=${relevamientoId}`);
        if (!res.ok) throw new Error("Error al obtener archivos");
        const data = await res.json();
        setArchivos(data.archivos || []);
      } catch (err) {
        toast.error("Error al cargar archivos");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivos();
  }, [relevamientoId]);

  if (loading) return <p>Cargando archivos...</p>;
  if (!archivos.length) return <p>No se encontraron archivos para este relevamiento.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {archivos.map((archivo, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <div className="mb-2 font-semibold">
            {archivo.tipo_archivo.toUpperCase()}
          </div>

          <div className="mb-2">
            {archivo.tipo_archivo === "imagen" ? (
              <Image
                src={archivo.archivo_url}
                alt="Vista previa"
                className="h-40 w-full object-cover rounded"
              />
            ) : (
              <iframe
                src={archivo.archivo_url}
                className="w-full h-40 rounded"
                title="Vista previa PDF"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <a
              href={archivo.archivo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline"
            >
              Ver / Descargar
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
