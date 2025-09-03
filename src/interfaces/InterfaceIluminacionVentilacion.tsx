export interface InterfaceIluminacionVentilacion {
  id: number;
  local_id: number;
  relevamiento_id: number;
  condicion: string;
  disponibilidad: string;
  superficie_iluminacion: number; // decimal(10,2)
  superficie_ventilacion: number ; // decimal(10,2)
}
