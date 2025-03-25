import { InstitucionesData } from "@/interfaces/Instituciones";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InstitucionState {
  institucionSeleccionada: number | undefined;
  instituciones: InstitucionesData[];
}

const initialState: InstitucionState = {
  institucionSeleccionada: undefined,
  instituciones: [],
};

const institucionSlice = createSlice({
  name: "institucion",
  initialState,
  reducers: {
    setInstitucionSeleccionada(
      state,
      action: PayloadAction<number | undefined>
    ) {
      state.institucionSeleccionada = action.payload;
    },
    setInstituciones(state, action: PayloadAction<InstitucionesData[]>) {
      state.instituciones = action.payload;
    },
  },
});

export const { setInstitucionSeleccionada, setInstituciones } =
  institucionSlice.actions;
export default institucionSlice.reducer;
