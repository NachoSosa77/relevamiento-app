export interface InstitucionesData {
    id?: number;
    departamento: string;
    localidad: string;
    modalidad_nivel: string;
    institucion: string;
    cue: number;
    cui: number;
    matricula: string;
    calle: string;
    numero: number;
    referencia: string;
}

export interface Institucion {
    id?: number;
    nombre: string;
    localidad: string;
    modalidad_nivel: string;
    cue: number;
    cui: number;
}
