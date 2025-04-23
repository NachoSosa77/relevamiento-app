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
  relevamientoId: number | undefined;
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
  relevamientoId: undefined,
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
    setRelevamientoId: (state, action: PayloadAction<number | undefined>) => {
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
    resetAreasExteriores: (state) => {
      state.areasExteriores = [];
    },
    resetEspacioEscolar: () => initialState,
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
} = espacioEscolarSlice.actions;

export default espacioEscolarSlice.reducer;
