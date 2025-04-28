// archivoSlice.ts (o donde manejes el estado de los archivos)
import { ServiciosBasicos } from "@/interfaces/ServiciosBasicos";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiciosBasicosState {
  servicios: ServiciosBasicos[];
}

const initialState: ServiciosBasicosState = {
  servicios: [],
};

const serviciosBasicosSlice = createSlice({
  name: "serviciosBasicos",
  initialState,
  reducers: {
    setServicios: (state, action: PayloadAction<ServiciosBasicos[]>) => {
      state.servicios = action.payload;
    },
    addServicio: (state, action: PayloadAction<ServiciosBasicos>) => {
      state.servicios.push(action.payload);
    },
    clearServicios: (state) => {
      state.servicios = [];
    },
  },
});

export const { setServicios, addServicio, clearServicios } =
  serviciosBasicosSlice.actions;

export default serviciosBasicosSlice.reducer;
