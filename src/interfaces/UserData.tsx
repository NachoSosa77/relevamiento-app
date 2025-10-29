export interface UserData {
  id: number;
  email: string;
  nombre: string | null;
  apellido: string | null;
  dni: string | null;
  roles?: string[]; // <- nuevo
}
