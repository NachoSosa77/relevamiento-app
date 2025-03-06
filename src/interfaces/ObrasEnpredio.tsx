export interface ObrasEnPredio {
    id?: number; // El 'id' ahora es opcional
    tipo_obra: string;
    estado: string;
    financiamiento: string;
    superficie_total: string;
    cue: number | null;
    destino: string;
  }
  
  export interface Column {
    header: string;
    key: keyof ObrasEnPredio;
    type: "select" | "input" | "text";
    options?: string[] | string[] | { id: number; label: string }[]; // ✅ Ahora acepta objetos;
    conditional?: (areas: ObrasEnPredio) => boolean;
  }
  