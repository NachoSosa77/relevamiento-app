import {
  Column,
  ServiciosTransporteComunicaciones,
} from "@/interfaces/ServiciosTransporteComunicaciones";

export const serviciosTransporteComunicaciones: Column[] = [
  { header: "3", key: "id_servicio", type: "text" },
  {
    header: "SERVICIOS DE TRANSPORTE Y COMUNICACIONES",
    key: "servicio",
    type: "text",
  },
  {
    header: "En el predio",
    key: "en_predio",
    type: "select",
    options: (servicio) => {
      if (servicio.id_servicio == "3.2") {
        return ["Continua", "Diaria", "Semanal", "Otra"];
      } else {
        return ["Sí", "No"];
      }
    },
    conditional: (servicio) => servicio.id_servicio != "3.3", // Solo habilitado si el servicio es diferente a "3.3"
  },
  {
    header: "Disponibilidad En la zona (1 km de radio)",
    key: "disponibilidad",
    type: "select",
    options: ["Sí", "No"],
    conditional: (servicio) =>
      (servicio.en_predio === "No" && servicio.id_servicio !== "2.6") ||
      servicio.id_servicio === "3.3", // Habilitado si en_predio es "No" (excepto "2.6") o si id_servicio es "3.3"
  },
  {
    header: "Distancia al predio (en m.)",
    key: "distancia",
    type: "input",
    conditional: (servicio) =>
      servicio.en_predio === "No" &&
      servicio.disponibilidad === "No" &&
      servicio.id_servicio != "2.6",
  },
];

export const serviciosDataTransporte: ServiciosTransporteComunicaciones[] = [
  {
    id_servicio: "3.1",
    servicio: "Pavimento",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.2",
    servicio: "Frecuencia de transporte público",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.3",
    servicio: "Correo postal",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.4",
    servicio: "Telefonía por cable",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.5",
    servicio: "Telefonía celular",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.6",
    servicio: "Acceso a internet",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.7",
    servicio: "Señal de radio AM",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.8",
    servicio: "Señal de radio FM",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.9",
    servicio: "TV por aire",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
  {
    id_servicio: "3.10",
    servicio: "TV por cable/satelital",
    en_predio: "",
    disponibilidad: "",
    distancia: "",
  },
];
