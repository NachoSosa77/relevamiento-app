import { Column, ServiciosBasicos } from "@/interfaces/ServiciosBasicos";

export const serviciosColumns: Column[] = [
  { header: "2", key: "id", type: "text" },
  { header: "Servicios básicos", key: "servicio", type: "text" },
  {
    header: "En el predio",
    key: "enPredio",
    type: "select",
    options: ["Sí", "No"],
  },
  {
    header: "Disponibilidad En la zona (1 km de radio)",
    key: "disponibilidad",
    type: "select",
    options: ["Sí", "No"],
    conditional: (servicio) =>
      servicio.enPredio === "No" && servicio.id != "2.6", // Solo habilitado si enPredio es "No"
  },
  {
    header: "Distancia al predio (en m.)",
    key: "distancia",
    type: "input",
    conditional: (servicio) =>
      servicio.enPredio === "No" &&
      servicio.disponibilidad === "Sí" &&
      servicio.id != "2.6", // Solo habilitado si enPredio y disponibilidad son "Sí"
  },
  {
    header: "Prestadores de servicios",
    key: "prestadores",
    type: "input",
    conditional: (servicio) =>
      (servicio.enPredio === "Sí" || servicio.disponibilidad === "Sí") &&
      servicio.id != "2.6", // Solo habilitado si enPredio y disponibilidad son "Sí"
  },
];

export const serviciosData: ServiciosBasicos[] = [
  {
    id: "2.1",
    servicio: "Alumbrado público",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.2",
    servicio: "Electricidad de Red",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.3",
    servicio: "Gas natural de red",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.4",
    servicio: "Agua corriente",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.5",
    servicio: "Red cloacal",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.6",
    servicio: "Planta de tratamiendo de líquidos cloacales",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.7",
    servicio: "Red de desagües pluviales",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
  {
    id: "2.8",
    servicio: "Recolección de residuos",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
    prestadores: "",
  },
];
