interface Opcion {
  id: number;
  prefijo: string;
  name: string;
}

interface Estructura {
  id: string; // ej: "13.2", "13.3", "13.1"
  question: string;
  showCondition: boolean; // true: tiene estado B/R/M; false: “No corresponde” (última col)
  opciones: Opcion[];
  sub_tipo?: "estructura" | "cubierta" | "materiales" | "terminaciones" | "n/a"; // 👈 nuevo        // catálogo para el <Select /> (excepto 13.1 que es Si/No)
}

export const estructuraResistente: Estructura[] = [
  {
    id: "10.1",
    question: "Tipo de estructura",
    showCondition: true,
    sub_tipo: "estructura", // ⬅️ NUEVO
    opciones: [
      {
        id: 1,
        prefijo: "A",
        name: "Independiente de hormigón armado",
      },
      {
        id: 2,
        prefijo: "B",
        name: "Independiente metálica",
      },
      {
        id: 3,
        prefijo: "C",
        name: "De madera",
      },
      {
        id: 4,
        prefijo: "D",
        name: "Muros portantes",
      },
      {
        id: 5,
        prefijo: "E",
        name: "Construcciones prefabricadas",
      },
      {
        id: 6,
        prefijo: "F",
        name: "Otro",
      },
    ],
  },
];

export const estructuraTecho: Estructura[] = [
  {
    id: "11.1",
    question: "Estructura",
    showCondition: true,
    sub_tipo: "estructura", // ⬅️ NUEVO
    opciones: [
      {
        id: 1,
        prefijo: "A",
        name: "Losa",
      },
      {
        id: 2,
        prefijo: "B",
        name: "Metálica",
      },
      {
        id: 3,
        prefijo: "C",
        name: "Madera",
      },
      {
        id: 4,
        prefijo: "D",
        name: "Bovedilla",
      },
      {
        id: 5,
        prefijo: "E",
        name: "Viguetas premoldeadas",
      },
      {
        id: 6,
        prefijo: "F",
        name: "Otro",
      },
    ],
  },
  {
    id: "11.2",
    question: "Cubierta",
    showCondition: true,
    sub_tipo: "cubierta", // ⬅️ NUEVO
    opciones: [
      {
        id: 1,
        prefijo: "A",
        name: "Membrana",
      },
      {
        id: 2,
        prefijo: "B",
        name: "Solado transitable",
      },
      {
        id: 3,
        prefijo: "C",
        name: "Tejas",
      },
      {
        id: 4,
        prefijo: "D",
        name: "Chapa de hierro galvanizado",
      },
      {
        id: 5,
        prefijo: "E",
        name: "Paja",
      },
      {
        id: 6,
        prefijo: "F",
        name: "Caña",
      },
      {
        id: 7,
        prefijo: "G",
        name: "Torta de barro",
      },
      {
        id: 8,
        prefijo: "H",
        name: "Paneles industriables",
      },
      {
        id: 9,
        prefijo: "I",
        name: "Otro",
      },
    ],
  },
];

export const paredesCerramientos: Estructura[] = [
  {
    id: "12.1",
    question: "Materiales",
    showCondition: true,
    sub_tipo: "materiales", // ⬅️ NUEVO
    opciones: [
      {
        id: 1,
        prefijo: "A",
        name: "Mampostería de ladrillo común",
      },
      {
        id: 2,
        prefijo: "B",
        name: "Mampostería de ladrillo o ladrillón hueco",
      },
      {
        id: 3,
        prefijo: "C",
        name: "Mampostería de bloques de hormigón",
      },
      {
        id: 4,
        prefijo: "D",
        name: "Chapa",
      },
      {
        id: 5,
        prefijo: "E",
        name: "Piedra",
      },
      {
        id: 6,
        prefijo: "F",
        name: "Adobe",
      },
      {
        id: 7,
        prefijo: "G",
        name: "Otro",
      },
    ],
  },
  {
    id: "12.2",
    question: "Terminaciones",
    showCondition: true,
    sub_tipo: "terminaciones", // ⬅️ NUEVO

    opciones: [
      {
        id: 1,
        prefijo: "A",
        name: "Ladrillo visto",
      },
      {
        id: 2,
        prefijo: "B",
        name: "Piedra",
      },
      {
        id: 3,
        prefijo: "C",
        name: "Chapa",
      },
      {
        id: 4,
        prefijo: "D",
        name: "Madera",
      },
      {
        id: 5,
        prefijo: "E",
        name: "Céramicos/azulejos/venecita",
      },
      {
        id: 6,
        prefijo: "F",
        name: "Marmol/granito",
      },
      {
        id: 7,
        prefijo: "G",
        name: "Revoque a la cal",
      },
      {
        id: 8,
        prefijo: "H",
        name: "Material de frente (de IGGAM o similar)",
      },
      {
        id: 9,
        prefijo: "I",
        name: "Pintura",
      },
      {
        id: 10,
        prefijo: "J",
        name: "Otro",
      },
    ],
  },
];

export const energiasAlternativas = [
  {
    id: "13.1",
    question:
      "¿El edificio cuenta con algún sistema que genere o permita el ahorro y la eficiencia energética? Ejemplo: La recolección de agua de lluvia. En caso afirmativo, insique cuales.",
    showCondition: false,
    opciones: [],
  },
];
