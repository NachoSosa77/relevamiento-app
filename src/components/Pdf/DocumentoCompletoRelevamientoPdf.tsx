"use client";

import { Document, StyleSheet } from "@react-pdf/renderer";
import { ArchivosDelRelevamiento } from "./ArchivosDelRelevamientoPdf";
import { ConstruccionPdf } from "./ConstruccionesPdf";
import { ConstruccionLocalesPdf } from "./ConstruccionLocalesPdf";
import { PdfRelevamientoResumen } from "./PdfRelevameintoResumen";

interface DocumentoCompletoProps {
  resumenData: any;
  construccionesData: any;
  localesData: any;
  archivosData: any;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1A202C",
    backgroundColor: "#FAFAFA",
  }
});

export const DocumentoCompletoRelevamiento = ({
  resumenData,
  construccionesData,
  localesData,
  archivosData,
}: DocumentoCompletoProps) => {
  return (
    <Document>
      {/* --- SECCIÓN: RESUMEN --- */}
      <PdfRelevamientoResumen data={resumenData} />

      {/* --- SECCIÓN: CONSTRUCCIONES --- */}
      <ConstruccionPdf data={construccionesData} />

      {/* --- SECCIÓN: CONSTRUCCIÓN Y LOCALES --- */}
      <ConstruccionLocalesPdf data={localesData} />

      {/* --- SECCIÓN: ARCHIVOS --- */}
      <ArchivosDelRelevamiento data={archivosData} />
    </Document>
  );
};
