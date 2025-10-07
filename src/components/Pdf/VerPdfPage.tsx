"use client";

import { getArchivosRelevamiento } from "@/app/lib/client/getArchivosRelevamiento";
import { getConstruccionesRelevamiento } from "@/app/lib/client/getConstruccionesRelevamiento";
import { getConstruccioneslocalesRelevamiento } from "@/app/lib/client/getConstruccionLocales";
import { getResumenRelevamiento } from "@/app/lib/client/getResumenRelevamiento";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { DocumentoCompletoRelevamiento } from "./DocumentoCompletoRelevamientoPdf";

interface Archivo {
  id: number;
  relevamiento_id: number | null;
  archivo_url: string;
  nombre_archivo: string | null;
  tipo_archivo: string | null;
  fecha_subida: string | null;
}

interface ArchivosDelRelevamientoProps {
  data: {
    relevamiento: {
      id: number;
      estado?: string;
      email?: string;
    };
    archivos: Archivo[];
  };
}

export default function VerPdfPage({
  relevamientoId,
}: {
  relevamientoId: number;
}) {
  const [resumenData, setResumenData] = useState(null);
  const [construccionesData, setConstruccionesData] = useState(null);
  const [localesData, setLocalesData] = useState(null);
  const [archivosData, setArchivosData] = useState<ArchivosDelRelevamientoProps["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdfIndex, setSelectedPdfIndex] = useState(0); // 👈 tab seleccionada

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resumen, construcciones, locales, archivos] = await Promise.all([
          getResumenRelevamiento(relevamientoId),
          getConstruccionesRelevamiento(relevamientoId),
          getConstruccioneslocalesRelevamiento(relevamientoId),
          getArchivosRelevamiento(relevamientoId),
        ]);

        setResumenData(resumen);
        setConstruccionesData(construcciones);
        setLocalesData(locales);
        setArchivosData(archivos);
      } catch (error) {
        console.error("Error al cargar los datos de los PDFs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [relevamientoId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <ClipLoader size={40} color="#3B82F6" />
        <p className="text-sm mt-4">Cargando...</p>
      </div>
    );
  }

  return (
        <div className="flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl">
        <div className="bg-gray-100 px-4 py-2 rounded-t-2xl border-b border-gray-200 text-center">
          <h2 className="text-lg font-medium text-gray-800">
            Documento completo del relevamiento
          </h2>
        </div>

        <PDFViewer width={800} height={1000} style={{ borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}>
          <DocumentoCompletoRelevamiento
            resumenData={resumenData}
            construccionesData={construccionesData}
            localesData={localesData}
            archivosData={archivosData}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
