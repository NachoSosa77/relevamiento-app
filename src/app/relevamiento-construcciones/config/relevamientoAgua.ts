export const servicioAgua = [
  { id: "3.1.1", question: "Por red pública", showCondition: false },
  {
    id: "3.1.2",
    question: "Por pozo o perforación con bomba manual",
    showCondition: true,
  },
  {
    id: "3.1.3",
    question: "Por pozo o perforación con bomba automática",
    showCondition: true,
  },
  {
    id: "3.1.4",
    question: "Pluvial (recolección de agua de lluvia)",
    showCondition: true,
  },
  { id: "3.1.5", question: "Por molino", showCondition: true },
  {
    id: "3.1.6",
    question: "Por algún manantial, vertiente o fuente de agua cercana",
    showCondition: false,
  },
  {
    id: "3.1.7",
    question: "Por camiones cisterna (externa)",
    showCondition: false,
  },
  {
    id: "3.1.8",
    question: "Agua cedida (por vecinos, docentes, comunidad, etc.)",
    showCondition: false,
  },
  {
    id: "3.1.9",
    question: "Agua envasada (bidones, agua mineral en botellas, etc.)",
    showCondition: false,
  },
  { id: "3.1.10", question: "Otro sistema", showCondition: false },
];

export const almacenamientoAgua = [
  { id: "3.2.1", question: "Aljibe", showCondition: true },
  { id: "3.2.2", question: "Cisterna", showCondition: true },
  { id: "3.2.3", question: "Tanque elevado", showCondition: true },
  { id: "3.2.4", question: "Torre Tanque", showCondition: true },
  { id: "3.2.5", question: "Bidones, botellas baldes", showCondition: false },
  { id: "3.2.6", question: "Otro sistema", showCondition: false },
];

export const provisionAgua = [
  {
    id: "3.3.1",
    question: "La provisión de agua abastece baños.",
    showCondition: false,
  },
  {
    id: "3.3.2",
    question: "La provisión de agua abastece cocina.",
    showCondition: false,
  },
  {
    id: "3.3.3",
    question:
      "La provisión de agua es suficiente para ser utilizada en caso de incendio.",
    showCondition: false,
  },
  {
    id: "3.3.4",
    question: "La provisión de agua abastece servicio de riego.",
    showCondition: false,
  },
];

export const calidadAgua = [
  {
    id: "3.4.1",
    question: "¿Se realiza tratamiento potabilizador del agua?",
    showCondition: true,
  },
  {
    id: "3.4.2",
    question: "¿Se realiza control sanitario de la calidad del agua?",
    showCondition: false,
  },
];
