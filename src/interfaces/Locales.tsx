export interface TipoLocales {
  id: number;
  name: string;
  tipo:string;
  tipo_superficie: string;
}

export interface Construccion {
  id?: number;
  numero_construccion?: number;
  superficie_cubierta?: number;
  superficie_semicubierta?: number;
  superficie_total?: number;
  relevamiento_id?: number;
  antiguedad?: string;
  destino?: string;
}

export interface LocalesPorConstruccion {
  id?: number;
  construccion_id?: number;
  identificacion_plano: number;
  numero_planta: number;
  tipo: string;
  local_sin_uso: string;
  superficie?: number;
  tipo_superficie: string;
  cui_number?: number;
  relevamiento_id?: number;
}
