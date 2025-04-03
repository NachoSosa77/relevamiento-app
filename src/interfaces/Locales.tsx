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
  tipo_local_id: number;
  local_sin_uso: string;
  superficie: number;
}
