/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getResumenRelevamiento } from "@/app/lib/client/getResumenRelevamiento";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { PdfRelevamientoResumen } from "./PdfRelevameintoResumen";

export default function VerPdfPage({ relevamientoId }: { relevamientoId: number }) {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const resumen = await getResumenRelevamiento(relevamientoId);
      setData(resumen);
    };
    fetchData();
  }, [relevamientoId]);

  console.log('data pdf', data)

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Vista previa PDF</h1>

      <div style={{ height: "800px" }}>
        <PDFViewer width="100%" height="100%">
          <PdfRelevamientoResumen data={data} />
        </PDFViewer>
      </div>

      <PDFDownloadLink
        document={<PdfRelevamientoResumen data={data} />}
        fileName={`relevamiento_${relevamientoId}.pdf`}
        className="btn mt-4"
      >
        {({ loading }) => (loading ? "Generando..." : "Descargar PDF")}
      </PDFDownloadLink>
    </div>
  );
}
