"use client";

import { getArchivosRelevamiento } from "@/app/lib/client/getArchivosRelevamiento";
import { getConstruccionesRelevamiento } from "@/app/lib/client/getConstruccionesRelevamiento";
import { getConstruccioneslocalesRelevamiento } from "@/app/lib/client/getConstruccionLocales";
import { getResumenRelevamiento } from "@/app/lib/client/getResumenRelevamiento";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { ArchivosDelRelevamiento } from "./ArchivosDelRelevamientoPdf";
import { ConstruccionPdf } from "./ConstruccionesPdf";
import { ConstruccionLocalesPdf } from "./ConstruccionLocalesPdf";
import { PdfRelevamientoResumen } from "./PdfRelevameintoResumen";

export default function VerPdfPage({
  relevamientoId,
}: {
  relevamientoId: number;
}) {
  const [resumenData, setResumenData] = useState(null);
  const [construccionesData, setConstruccionesData] = useState(null);
  const [localesData, setLocalesData] = useState(null);
  const [archivosData, setArchivosData] = useState(null);
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

  console.log("VerPdfPage data", localesData)

  const pdfs = [
    {
      title: "Resumen del relevamiento",
      component: <PdfRelevamientoResumen data={resumenData} />,
    },
    {
      title: "Construcciones",
      component: <ConstruccionPdf data={construccionesData} />,
    },
    {
      title: "Construcción y locales",
      component: <ConstruccionLocalesPdf data={localesData} />,
    },
    {
      title: "Archivos del relevamiento",
      component: <ArchivosDelRelevamiento data={archivosData} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <ClipLoader size={40} color="#3B82F6" />
        <p className="text-sm mt-4">Cargando PDFs...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center flex-wrap">
        {pdfs.map((pdf, index) => (
          <button
            key={index}
            onClick={() => setSelectedPdfIndex(index)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              selectedPdfIndex === index
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pdf.title}
          </button>
        ))}
      </div>

      {/* PDFViewer con el PDF seleccionado */}
      <div className="flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl">
          <div className="bg-gray-100 px-4 py-2 rounded-t-2xl border-b border-gray-200 text-center">
            <h2 className="text-lg font-medium text-gray-800">
              {pdfs[selectedPdfIndex].title}
            </h2>
          </div>

          <PDFViewer
            key={selectedPdfIndex} // 👈 fuerza el remount
            width={600}
            height={800}
            style={{
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          >
            {pdfs[selectedPdfIndex].component}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
