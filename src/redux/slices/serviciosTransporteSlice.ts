// store/serviciosTransporteSlice.ts
import { ServiciosTransporteComunicaciones } from "@/interfaces/ServiciosTransporteComunicaciones";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiciosTransporteState {
  servicios: ServiciosTransporteComunicaciones[];
}

const initialState: ServiciosTransporteState = {
  servicios: [],
};

const serviciosTransporteSlice = createSlice({
  name: "servicios_transporte",
  initialState,
  reducers: {
    setServicios: (
      state,
      action: PayloadAction<ServiciosTransporteComunicaciones[]>
    ) => {
      state.servicios = action.payload;
    },
  },
});

export const { setServicios } = serviciosTransporteSlice.actions;

export default serviciosTransporteSlice.reducer;
