export interface FactoresRiesgoAmbiental {
  id: string;
  riesgo: string;
  respuesta: string;
  mitigacion: string;
  descripcion: string;
  descripcionOtro: string;
}

export interface Column {
  header: string;
  key: keyof FactoresRiesgoAmbiental;
  type: "select" | "input" | "text";
  options?: string[];
  conditional?: (factores: FactoresRiesgoAmbiental) => boolean;
}
