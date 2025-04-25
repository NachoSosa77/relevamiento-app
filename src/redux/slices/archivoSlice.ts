// archivoSlice.ts (o donde manejes el estado de los archivos)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ArchivoState {
  archivosSubidos: string[]; // Puedes almacenar solo las URLs, o los objetos completos si lo prefieres
}

const initialState: ArchivoState = {
  archivosSubidos: [],
};

const archivoSlice = createSlice({
  name: "archivos",
  initialState,
  reducers: {
    setArchivosSubidos: (state, action: PayloadAction<string[]>) => {
      state.archivosSubidos = action.payload;
    },
  },
});

export const { setArchivosSubidos } = archivoSlice.actions;
export default archivoSlice.reducer;
