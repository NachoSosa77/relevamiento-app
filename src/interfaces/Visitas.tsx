export interface Visita {
    id?: number;
    numero_visita: string;
    fecha: string;
    hora_inicio: string;
    hora_finalizacion: string;
    observaciones: string;
    relevamiento_id?: number;
}
