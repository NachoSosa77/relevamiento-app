// src/types/estadoConservacion.ts
export interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

export type SubTipo =
  | "estructura"
  | "cubierta"
  | "materiales"
  | "terminaciones"
  | "n/a";

export interface Estructura {
  id: string; // ej "11.1"
  question: string;
  showCondition: boolean;
  opciones: Opcion[];
  sub_tipo?: SubTipo;
}
