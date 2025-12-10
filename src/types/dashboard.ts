// src/types/dashboard-pdf.ts
export type DashboardResumen = {
  kpis?: {
    edificios: number;
    aulas: number;
    m2: number;
  };
  charts?: {
    kpiPorNivel?: string;
    construccionesPorConservacion?: string;
    edificiosPorNivelYConservacion?: string;
  };
};
