/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServicioAguaSeleccionado {
  servicio: string;
  estado?: string;
  relevamiento_id?: number;
}

interface AguaState {
  serviciosAguaSeleccionados: ServicioAguaSeleccionado[];
  provision: { servicio?: string; estado?: string } | null; // Aunque no se use en los reducers actuales
  almacenamiento: { servicio?: string; estado?: string } | null; // Aunque no se use en los reducers actuales
  alcance: string | null; // Aunque no se use en los reducers actuales
  calidad: string | null; // Aunque no se use en los reducers actuales
  relevamiento_id?: number; // Aunque no se use en los reducers actuales
}

const initialState: AguaState = {
  serviciosAguaSeleccionados: [],
  provision: null,
  almacenamiento: null,
  alcance: null,
  calidad: null,
  relevamiento_id: undefined,
};

// Crea el slice de Redux para "servicio_agua"
export const servicioAguaSlice = createSlice({
  name: "servicio_agua",
  initialState,
  reducers: {
    // Acción para agregar un servicio de agua seleccionado
    agregarServicioAgua: (
      state,
      action: PayloadAction<{
        servicio: string;
        estado?: string;
        relevamiento_id?: number;
      }>
    ) => {
      const { servicio, estado, relevamiento_id } = action.payload;
      const servicioExistente = state.serviciosAguaSeleccionados.find(
        (s) => s.servicio === servicio
      );
      if (!servicioExistente) {
        state.serviciosAguaSeleccionados.push({
          servicio,
          estado,
          relevamiento_id,
        });
      } else if (estado !== undefined) {
        // Si el servicio ya existe, actualiza el estado si se proporciona
        state.serviciosAguaSeleccionados = state.serviciosAguaSeleccionados.map(
          (s) => (s.servicio === servicio ? { ...s, estado } : s)
        );
      }
    },
    // Acción para eliminar un servicio de agua seleccionado
    eliminarServicioAgua: (state, action: PayloadAction<string>) => {
      state.serviciosAguaSeleccionados =
        state.serviciosAguaSeleccionados.filter(
          (s) => s.servicio !== action.payload
        );
    },
    // Acción para limpiar todos los servicios de agua seleccionados
    limpiarServiciosAgua: (state) => {
      state.serviciosAguaSeleccionados = [];
    },
    // Acción para actualizar el relevamiento_id de todos los servicios de agua
    actualizarRelevamientoIdAgua: (state, action: PayloadAction<number>) => {
      state.serviciosAguaSeleccionados = state.serviciosAguaSeleccionados.map(
        (s) => ({ ...s, relevamiento_id: action.payload })
      );
    },
  },
});

// Exporta las acciones del slice
export const {
  agregarServicioAgua,
  eliminarServicioAgua,
  limpiarServiciosAgua,
  actualizarRelevamientoIdAgua,
} = servicioAguaSlice.actions;

// Exporta el selector para acceder al estado de los servicios de agua
export const selectServiciosAgua = (state: any) =>
  state.servicio_agua.serviciosAguaSeleccionados;

// Exporta el reducer del slice para ser incluido en la configuración del store
export default servicioAguaSlice.reducer;
