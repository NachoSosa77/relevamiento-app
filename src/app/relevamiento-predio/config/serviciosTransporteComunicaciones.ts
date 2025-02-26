import {
  Column,
  ServiciosTransporteComunicaciones,
} from "@/interfaces/ServiciosTransporteComunicaciones";

export const serviciosTransporteComunicaciones: Column[] = [
  { header: "3", key: "id", type: "text" },
  {
    header: "SERVICIOS DE TRANSPORTE Y COMUNICACIONES",
    key: "servicio",
    type: "text",
  },
  {
    header: "En el predio",
    key: "enPredio",
    type: "select",
    options: (servicio) => {
      if (servicio.id == "3.2") {
        return ["Continua", "Diaria", "Semanal", "Otra"];
      } else {
        return ["Sí", "No"];
      }
    },
    conditional: (servicio) => servicio.id != "3.3", // Solo habilitado si el servicio es diferente a "3.3"
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
];

export const serviciosDataTransporte: ServiciosTransporteComunicaciones[] = [
  {
    id: "3.1",
    servicio: "Pavimento",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.2",
    servicio: "Frecuencia de transporte público",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.3",
    servicio: "Correo postal",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.4",
    servicio: "Telefonía por cable",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.5",
    servicio: "Telefonía celular",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.6",
    servicio: "Acceso a internet",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.7",
    servicio: "Señal de radio AM",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.8",
    servicio: "Señal de radio FM",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.9",
    servicio: "TV por aire",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id: "3.10",
    servicio: "TV por cable/satelital",
    enPredio: "",
    disponibilidad: "",
    distancia: "",
  },
];
