export interface ServiciosBasicos {
    id: string;
    servicio: string;
    enPredio: string;
    disponibilidad: string;
    distancia: string;
    prestadores: string;
  }
  export interface Column {
    header: string;
    key: keyof ServiciosBasicos;
    type: "select" | "input" | "text";
    options?:
       string[]
      | ((servicio: ServiciosBasicos) => string[]);
    conditional?: (servicio: ServiciosBasicos) => boolean;
  }