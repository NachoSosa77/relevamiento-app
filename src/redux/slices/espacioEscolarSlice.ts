import { AreasExteriores } from "@/interfaces/AreaExterior";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { LocalesConstruccion } from "@/interfaces/Locales";
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
  contextId: number | null;
  areasExteriores: AreasExteriores[];
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
  contextId: null,
  areasExteriores: [],
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
    setInstitucionesData: (
      state,
      action: PayloadAction<InstitucionesData[]>
    ) => {
      state.institucionesSeleccionadas = action.payload;
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
    setLocales: (state, action: PayloadAction<LocalesConstruccion>) => {
      state.locales = state.locales || []; // Asegura que no sea null
      state.locales.push(action.payload);
    },
    addAreasExteriores: (state, action: PayloadAction<AreasExteriores>) => {
      state.areasExteriores.push(action.payload);
    },
    resetAreasExteriores: (state) => {
      state.areasExteriores = [];
    },
    setContextId: (state, action: PayloadAction<number | null>) => {
      state.contextId = action.payload;
    },
    resetEspacioEscolar: () => initialState,
  },
});

export const {
  setCui,
  setInstitucionId,
  setInstitucionesData,
  setCantidadConstrucciones,
  setSuperficieTotalPredio,
  setPlano,
  setObservaciones,
  setLocales,
  addAreasExteriores,
  resetAreasExteriores,
  setContextId,
  resetEspacioEscolar,
} = espacioEscolarSlice.actions;

export default espacioEscolarSlice.reducer;
