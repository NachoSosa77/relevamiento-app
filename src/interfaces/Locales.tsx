export interface TipoLocales {
  id: number;
  name: string;
}

export interface LocalesConstruccion {
  id?: number;
  numero_construccion?: number;
  superficie_cubierta?: number;
  superficie_semicubierta?: number;
  superficie_total?: number;
  identificacion_plano: number;
  numero_planta: number;
  tipo: string;
  local_sin_uso: string;
  superficie: number;
  cui_number?: number;
  relevamiento_id?: number;
}
