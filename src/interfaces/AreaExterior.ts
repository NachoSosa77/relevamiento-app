export interface AreasExteriores {
  id?: number; // El 'id' ahora es opcional
  identificacion_plano: string;
  tipo: string;
  superficie: string;
  estado_conservacion?: string | null;
  terminacion_piso?: string | null;
}

export interface Column {
  header: string;
  key: keyof AreasExteriores;
  type: "select" | "input" | "text";
  options?: string[];
  conditional?: (areas: AreasExteriores) => boolean;
}
