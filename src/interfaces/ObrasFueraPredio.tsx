export interface ObrasFueraPredio {
    id?: number; // El 'id' ahora es opcional
    tipo_obra: string;
    domicilio: string;
    cue: number | null;
    destino: string[];
    relevamiento_id: number | undefined;
  }
  
  export interface Column {
    header: string;
    key: keyof ObrasFueraPredio;
    type: "select" | "input" | "text";
    options?: string[] | string[] | { id: number; label: string }[]; // ✅ Ahora acepta objetos;
    conditional?: (areas: ObrasFueraPredio) => boolean;
  }
  