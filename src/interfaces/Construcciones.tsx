import { Plantas } from "./Plantas";

export interface Construcciones {
    id: number;
    relevamiento_id: number;
    numero_construccion: number;
    antiguedad: string;
    destino: string;
    plantas?: Plantas[];
}
