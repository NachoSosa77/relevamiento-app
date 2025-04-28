export interface FactoresRiesgoAmbiental {
  id?: number;
  id_servicio: string;
  riesgo?: string;
  respuesta?: string;
  mitigacion?: string;
  descripcion?: string;
  descripcionOtro?: string;
  relevamiento_id?: number; // Agregado para el envío al backend
}

export interface Column {
  header: string;
  key: keyof FactoresRiesgoAmbiental;
  type: "select" | "input" | "text";
  options?: string[];
  conditional?: (factores: FactoresRiesgoAmbiental) => boolean;
}
