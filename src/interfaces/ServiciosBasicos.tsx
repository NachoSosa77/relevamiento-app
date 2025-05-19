export interface ServiciosBasicos {
    id?: number;
    id_servicio: string; // Ej: "2.1"
    servicio: string;
    en_predio?: string; // Opcional
    disponibilidad?: string;
    distancia: string;
    prestadores: string;
    relevamiento_id?: number; // El ID del relevamiento relacionado

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
