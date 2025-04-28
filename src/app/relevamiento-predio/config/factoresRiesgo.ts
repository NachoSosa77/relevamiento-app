import {
  Column,
  FactoresRiesgoAmbiental,
} from "@/interfaces/FactoresRiesgoAmbienta";

export const factoresRiesgoColumns: Column[] = [
  { header: "4", key: "id_servicio", type: "text" },
  { header: "FACTORES DE RIESGO AMBIENTAL", key: "riesgo", type: "text" },
  {
    header: "",
    key: "respuesta",
    type: "select",
    options: ["Sí", "No", "No sabe"],
  },
  {
    header: "Método de mitigación",
    key: "mitigacion",
    type: "select",
    options: ["Sí", "No"],
    conditional: (factores) =>
      factores.respuesta === "Sí" &&
      ["4.5", "4.6"].includes(factores.id_servicio),
  },
  {
    header: "Descripción",
    key: "descripcion",
    type: "select",
    options: [
      "Elevación nivel de las construcciones sobre cota de inundabilidad",
      "Defensas Artificiales",
      "Otro",
    ],
    conditional: (factores) =>
      factores.mitigacion === "Sí" &&
      ["4.5", "4.6"].includes(factores.id_servicio),
  },
  {
    header: "Indique:",
    key: "descripcionOtro",
    type: "input",
    conditional: (factores) =>
      factores.mitigacion === "Sí" &&
      factores.descripcion === "Otro" &&
      ["4.5", "4.6"].includes(factores.id_servicio),
  },
];

export const factoresRiesgoData: FactoresRiesgoAmbiental[] = [
  {
    id_servicio: "4.1",
    riesgo:
      "¿El predio se encuentra a menos de 500 mts de basurales / rellenos sanitarios?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
  {
    id_servicio: "4.2",
    riesgo: "¿El predio se encuentra a menos de 500 mts de mataderos?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
  {
    id_servicio: "4.3",
    riesgo:
      "¿El predio se encuentra a menos de 500 mts de depósitos de sustancias inflamables o explosivos?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
  {
    id_servicio: "4.4",
    riesgo:
      "¿El predio se encuentra a menos de 500 mts de fábricas u otro foco contaminante?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
  {
    id_servicio: "4.5",
    riesgo: "¿Es zona inundable?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
  {
    id_servicio: "4.6",
    riesgo: "¿Existe algún otro factor de riesgo ambiental?",
    respuesta: "",
    mitigacion: "",
    descripcion: "",
    descripcionOtro: "",
  },
];
