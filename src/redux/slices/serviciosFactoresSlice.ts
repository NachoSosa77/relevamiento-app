// store/serviciosTransporteSlice.ts
import { FactoresRiesgoAmbiental } from "@/interfaces/FactoresRiesgoAmbienta";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiciosFactoresState {
  servicios: FactoresRiesgoAmbiental[];
}

const initialState: ServiciosFactoresState = {
  servicios: [],
};

const serviciosFactoresSlice = createSlice({
  name: "servicios_factores",
  initialState,
  reducers: {
    setFactores: (state, action: PayloadAction<FactoresRiesgoAmbiental[]>) => {
      state.servicios = action.payload;
    },
  },
});

export const { setFactores } = serviciosFactoresSlice.actions;

export default serviciosFactoresSlice.reducer;
