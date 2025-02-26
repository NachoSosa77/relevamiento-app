export interface ServiciosTransporteComunicaciones {
  id: string;
  servicio: string;
  enPredio: string | null;
  disponibilidad: string | null;
  distancia: string;
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
