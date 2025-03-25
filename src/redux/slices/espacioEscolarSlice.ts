import { AreasExteriores } from "@/interfaces/AreaExterior";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EspacioEscolarState {
  institucion: number | undefined; // Reemplaza 'string' con el tipo correcto
  cantidadConstrucciones: number | undefined;
  superficieTotalPredio: number | undefined;
  plano: string | null; // Reemplaza 'string' con el tipo correcto
  areaExteriorId: string | null; // Reemplaza 'string' con el tipo correcto
  localId: string | null; // Reemplaza 'string' con el tipo correcto
  observaciones: string | null; // Reemplaza 'string' con el tipo correcto
  locales: string | null; // Reemplaza 'string' con el tipo correcto
  contextId: number | null;
  areasExteriores: AreasExteriores[];
}

const initialState: EspacioEscolarState = {
  institucion: undefined,
  cantidadConstrucciones: undefined,
  superficieTotalPredio: undefined,
  plano: null,
  areaExteriorId: null,
  localId: null,
  observaciones: null,
  locales: null,
  contextId: null,
  areasExteriores: [],
};

const espacioEscolarSlice = createSlice({
  name: "espacio_escolar",
  initialState,
  reducers: {
    setInstitucion: (state, action: PayloadAction<number | undefined>) => {
      state.institucion = action.payload;
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
    setAreaExteriorId: (state, action: PayloadAction<string | null>) => {
      state.areaExteriorId = action.payload;
    },
    setLocalId: (state, action: PayloadAction<string | null>) => {
      state.localId = action.payload;
    },
    setObservaciones: (state, action: PayloadAction<string | null>) => {
      state.observaciones = action.payload;
    },
    setLocales: (state, action: PayloadAction<string | null>) => {
      state.locales = action.payload;
    },
    addAreaExterior: (state, action: PayloadAction<AreasExteriores>) => {
      state.areasExteriores.push(action.payload);
    },
    setContextId: (state, action: PayloadAction<number | null>) => {
      state.contextId = action.payload;
    },
  },
});

export const {
  setInstitucion,
  setCantidadConstrucciones,
  setSuperficieTotalPredio,
  setPlano,
  setAreaExteriorId,
  setLocalId,
  setObservaciones,
  setLocales,
  addAreaExterior,
} = espacioEscolarSlice.actions;

export default espacioEscolarSlice.reducer;
