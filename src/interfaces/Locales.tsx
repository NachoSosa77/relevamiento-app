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

export interface Servicios {
  sanitarios?: boolean;
}

export interface LocalesConstruccion {
  id?: number;
  construccion_id?: number;
  identificacion_plano: number;
  numero_planta: number;
  tipo: string;
  local_id: number;
  local_sin_uso: string;
  destino_original?: string;
  superficie?: number;
  tipo_superficie: string;
  cui_number?: number;
  relevamiento_id?: number;
  largo_predominante?: number,
  ancho_predominante?: number,
  altura_maxima?: number,
  altura_minima?: number,
  diametro?: number,
  proteccion_contra_robo?: string,
  observaciones?: string,
  servicios?: Servicios;  // <-- Lo agregamos acá
  estado?: string;
  numero_construccion?: number;
  nombre_local?: string;
}
