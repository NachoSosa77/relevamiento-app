export interface EstadoConservacionItem {
  id: number;
  relevamiento_id: number;
  estructura: string; // Este campo lo necesitás sí o sí
  disponibilidad: string;
  estado: string;
  construccion_id: number;
  tipo: string;
  sub_tipo: string | null;
  observaciones?: string;
}

export interface DatosDelRelevamientoPDFProps {
  c: {
    estadoConservacion: EstadoConservacionItem[];
  };
}
