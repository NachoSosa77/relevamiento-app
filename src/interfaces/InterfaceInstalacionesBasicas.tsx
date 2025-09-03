// Lo que realmente devuelve la API (DB)
export interface InstalacionBasica {
  id: number;
  local_id: number;
  relevamiento_id: number;
  servicio: string;
  tipo_instalacion: string;
  funciona: string;
  motivo: string | null;
}

// Estado local en el componente (puede tener otros campos auxiliares)
export interface ResponseState {
  id?: number;
  disponibilidad?: string;
  funciona?: string;
  motivo?: string;
  otroMotivo?: string;
}
