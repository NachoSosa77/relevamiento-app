import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Archivo {
  archivo_url: string;
  tipo_archivo: string;
  relevamiento_id: string;
}

interface ArchivoState {
  archivosSubidos: Archivo[];
}

const initialState: ArchivoState = {
  archivosSubidos: [],
};

const archivoSlice = createSlice({
  name: "archivos",
  initialState,
  reducers: {
    setArchivosSubidos: (state, action: PayloadAction<Archivo[]>) => {
      state.archivosSubidos = action.payload;
    },
    resetArchivos: (state) => {
      state.archivosSubidos = [];
    },
  },
});

export const { setArchivosSubidos, resetArchivos } = archivoSlice.actions;
export default archivoSlice.reducer;
