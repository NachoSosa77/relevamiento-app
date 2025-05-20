import { AreasExteriores } from "@/interfaces/AreaExterior";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { LocalesConstruccion } from "@/interfaces/Locales";
import { Respondiente } from "@/interfaces/Respondientes";
import { Visita } from "@/interfaces/Visitas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EspacioEscolarState {
  cui: number | undefined;
  institucion: number | undefined;
  institucionesSeleccionadas: InstitucionesData[];
  cantidadConstrucciones: number | undefined;
  superficieTotalPredio: number | undefined;
  plano: string | null;
  observaciones: string | null;
  locales: LocalesConstruccion[];
  areasExteriores: AreasExteriores[];
  relevamientoId: number;
  visitas: Visita[];
  respondientes: Respondiente[];
}

const initialState: EspacioEscolarState = {
  cui: undefined,
  institucion: undefined,
  institucionesSeleccionadas: [],
  cantidadConstrucciones: undefined,
  superficieTotalPredio: undefined,
  plano: null,
  observaciones: null,
  locales: [],
  areasExteriores: [],
  relevamientoId: 0,
  visitas: [],
  respondientes: [],
};

const espacioEscolarSlice = createSlice({
  name: "espacio_escolar",
  initialState,
  reducers: {
    setCui: (state, action: PayloadAction<number | undefined>) => {
      state.cui = action.payload;
    },
    setInstitucionId: (state, action: PayloadAction<number | undefined>) => {
      state.institucion = action.payload;
    },
    setRelevamientoId: (state, action: PayloadAction<number>) => {
      state.relevamientoId = action.payload;
    },
    setInstitucionesData: (
      state,
      action: PayloadAction<InstitucionesData[]>
    ) => {
      state.institucionesSeleccionadas = action.payload;
    },
    deleteInstitucionData(state, action: PayloadAction<number>) {
      state.institucionesSeleccionadas =
        state.institucionesSeleccionadas.filter(
          (institucion) => institucion.id !== action.payload
        );
    },

    setCantidadConstrucciones: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.cantidadConstrucciones = action.payload;
    },
    setSuperficieTotalPredio: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.superficieTotalPredio = action.payload;
    },
    setPlano: (state, action: PayloadAction<string | null>) => {
      state.plano = action.payload;
    },
    setObservaciones: (state, action: PayloadAction<string | null>) => {
      state.observaciones = action.payload;
    },
    setLocales: (state, action: PayloadAction<LocalesConstruccion[]>) => {
      state.locales = action.payload;
    },
    addAreasExteriores: (state, action: PayloadAction<AreasExteriores>) => {
      state.areasExteriores.push(action.payload);
    },
    deleteAreasExteriores: (state, action: PayloadAction<number>) => {
      // Eliminar el área exterior con identificacion_plano
      state.areasExteriores = state.areasExteriores.filter(
        (area) => area.identificacion_plano !== action.payload
      );
    },
    resetInstituciones: (state) => {
      state.institucionesSeleccionadas = [];
    },
    resetAreasExteriores: (state) => {
      state.areasExteriores = [];
    },
    resetEspacioEscolar: () => initialState,
    agregarVisita(state, action: PayloadAction<Visita>) {
      state.visitas = [...state.visitas, action.payload]; // Utilizando el spread operator
    },
    // Acción para actualizar una visita
    actualizarVisita(state, action: PayloadAction<Visita>) {
      const index = state.visitas.findIndex(
        (visita) => visita.id === action.payload.id
      );
      if (index !== -1) {
        state.visitas[index] = action.payload; // Actualizamos la visita en el estado
      }
    },

    // Acción para eliminar una visita
    eliminarVisita(state, action: PayloadAction<number>) {
      state.visitas = state.visitas.filter(
        (visita) => visita.id !== action.payload
      ); // Filtramos la visita a eliminar
    },
    agregarRespondiente(state, action: PayloadAction<Respondiente>) {
      state.respondientes = [...state.respondientes, action.payload]; // Utilizando el spread operator
    },
    eliminarRespondiente(state, action: PayloadAction<number>) {
      state.respondientes = state.respondientes.filter(
        (_, index) => index !== action.payload
      ); // Filtramos el respondiente a eliminar
    },
  },
});

export const {
  setCui,
  setInstitucionId,
  setRelevamientoId,
  setInstitucionesData,
  deleteInstitucionData,
  setCantidadConstrucciones,
  setSuperficieTotalPredio,
  setPlano,
  setObservaciones,
  setLocales,
  addAreasExteriores,
  deleteAreasExteriores,
  resetAreasExteriores,
  resetEspacioEscolar,
  agregarVisita,
  actualizarVisita,
  eliminarVisita,
  agregarRespondiente,
  eliminarRespondiente,
  resetInstituciones,
} = espacioEscolarSlice.actions;

export default espacioEscolarSlice.reducer;
