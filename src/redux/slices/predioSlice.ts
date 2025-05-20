import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PredioState {
  observaciones: string | null;
  predioId: number | null;
}

const initialState: PredioState = {
  observaciones: null,
  predioId: null,
};

const predioSlice = createSlice({
  name: "predio",
  initialState,
  reducers: {
    setPredioId: (state, action) => {
      state.predioId = action.payload;
    },
    setObservaciones: (state, action: PayloadAction<string | null>) => {
      state.observaciones = action.payload;
    },
  },
});

export const { setObservaciones, setPredioId } = predioSlice.actions;

export default predioSlice.reducer;
