export interface ServiciosTransporteComunicaciones {
  id?: number;
  id_servicio: string;
  servicio: string;
  en_predio?: string;
  disponibilidad?: string;
  distancia: string;
  relevamiento_id?: number; // El ID del relevamiento relacionado

}
export interface Column {
  header: string;
  key: keyof ServiciosTransporteComunicaciones;
  type: "select" | "input" | "text";
  options?:
    | string[]
    | ((servicio: ServiciosTransporteComunicaciones) => string[]);
  conditional?: (servicio: ServiciosTransporteComunicaciones) => boolean;
}
