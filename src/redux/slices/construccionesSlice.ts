import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Plantas {
  subsuelo?: number;
  pb?: number;
  pisos_superiores?: number;
  total_plantas?: number;
}

interface Construccion {
  id: number;
  numero_construccion: number;
  relevamiento_id: number;
  plantas?: Plantas; // Nuevo campo
  antiguedad?: string; // Agregar antiguedad si es necesario
  destino?: string; // Agregar destino si es necesario
}

interface ConstruccionesState {
  construcciones: Construccion[];
  construccionTemporal: Construccion | null;
  construccionEnviada: Construccion | null; // Campo para los datos enviados
}

const initialState: ConstruccionesState = {
  construcciones: [],
  construccionTemporal: null,
  construccionEnviada: null, // Inicializar como null
};

export const construccionesSlice = createSlice({
  name: "construcciones",
  initialState,
  reducers: {
    addConstruccion: (state, action: PayloadAction<Construccion>) => {
      state.construcciones.push(action.payload);
    },
    updateNumeroConstruccion: (
      state,
      action: PayloadAction<{ index: number; numero_construccion: number }>
    ) => {
      const { index, numero_construccion } = action.payload;
      if (state.construcciones[index]) {
        state.construcciones[index].numero_construccion = numero_construccion;
      }
    },
    updatePlantas: (
      state,
      action: PayloadAction<{ index: number; plantas: Plantas }>
    ) => {
      const { index, plantas } = action.payload;
      if (state.construcciones[index]) {
        state.construcciones[index].plantas = plantas;
      }
    },
    resetConstrucciones: (state) => {
      state.construcciones = [];
    },
    setConstruccionTemporal: (
      state,
      action: PayloadAction<Construccion | null>
    ) => {
      state.construccionTemporal = action.payload;
    },
    updatePlantasTemporales: (state, action: PayloadAction<Plantas>) => {
      if (state.construccionTemporal) {
        state.construccionTemporal.plantas = action.payload;
      }
    },
    // Agregar acción para almacenar los datos enviados
    setConstruccionEnviada: (
      state,
      action: PayloadAction<Construccion | null>
    ) => {
      state.construccionEnviada = action.payload;
    },
  },
});

export const {
  addConstruccion,
  updateNumeroConstruccion,
  updatePlantas,
  resetConstrucciones,
  setConstruccionTemporal,
  updatePlantasTemporales,
  setConstruccionEnviada, // Exportar la acción
} = construccionesSlice.actions;

export default construccionesSlice.reducer;
