import { Column, ServiciosBasicos } from "@/interfaces/ServiciosBasicos";

export const serviciosColumns: Column[] = [
  { header: "2", key: "id", type: "text" },
  { header: "Servicios básicos", key: "servicio", type: "text" },
  {
    header: "En el predio",
    key: "en_predio",
    type: "select",
    options: ["Sí", "No"],
  },
  {
    header: "Disponibilidad En la zona (1 km de radio)",
    key: "disponibilidad",
    type: "select",
    options: ["Sí", "No"],
    conditional: (servicio) =>
      servicio.en_predio === "No" && servicio.id_servicio != "2.6", // Solo habilitado si en_predio es "No"
  },
  {
    header: "Distancia al predio (en m.)",
    key: "distancia",
    type: "input",
    conditional: (servicio) =>
      servicio.en_predio === "No" &&
      servicio.disponibilidad === "No" &&
      servicio.id_servicio != "2.6", // Solo habilitado si en_predio y disponibilidad son "Sí"
  },
  {
    header: "Prestadores de servicios",
    key: "prestadores",
    type: "input",
    conditional: (servicio) =>
      (servicio.en_predio === "Sí" ||
        servicio.disponibilidad === "Sí" ||
        servicio.en_predio === "No" ||
        servicio.disponibilidad === "No") &&
      servicio.id_servicio != "2.6", // Solo habilitado si en_predio y disponibilidad son "Sí"
  },
];

export const serviciosData: ServiciosBasicos[] = [
  {
    id_servicio: "2.1",
    servicio: "Alumbrado público",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.2",
    servicio: "Electricidad de Red",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.3",
    servicio: "Gas natural de red",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.4",
    servicio: "Agua corriente",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.5",
    servicio: "Red cloacal",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.6",
    servicio: "Planta de tratamiendo de líquidos cloacales",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.7",
    servicio: "Red de desagües pluviales",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id_servicio: "2.8",
    servicio: "Recolección de residuos",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
];
