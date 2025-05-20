export interface Visita {
    id?: number;
    numero_visita: number;
    fecha: string;
    hora_inicio: string;
    hora_finalizacion: string;
    observaciones: string;
    relevamiento_id?: number;
}
