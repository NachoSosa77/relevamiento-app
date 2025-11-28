/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
// ❌ NO usar más esto:
// import storage from "redux-persist/lib/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { relevamientoStorageMiddleware } from "./middlewares/relevamientoStorageMiddleware";
import archivoReducer from "./slices/archivoSlice";
import construccionesReducer from "./slices/construccionesSlice";
import espacioEscolarReducer from "./slices/espacioEscolarSlice";
import institucionReducer from "./slices/institucionSlice";
import predioReducer from "./slices/predioSlice";
import servicioAguaReducer from "./slices/servicioAguaSlice";
import serviciosFactoresReducer from "./slices/serviciosFactoresSlice";
import serviciosReducer from "./slices/serviciosSlice";
import serviciosTransporteReducer from "./slices/serviciosTransporteSlice";

// ----------------------
// 1) Root reducer
// ----------------------
const rootReducer = combineReducers({
  espacio_escolar: espacioEscolarReducer,
  institucion: institucionReducer,
  archivos: archivoReducer,
  servicios_basicos: serviciosReducer,
  servicios_transporte: serviciosTransporteReducer,
  servicios_factores: serviciosFactoresReducer,
  construcciones: construccionesReducer,
  servicio_agua: servicioAguaReducer,
  predio: predioReducer,
});

// ----------------------
// 2) Storage seguro para SSR
// ----------------------
function createNoopStorage() {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string) {
      return Promise.resolve();
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
}

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

// ----------------------
// 3) Persist config
// ----------------------
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ----------------------
// 4) Store + persistor
// ----------------------
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(relevamientoStorageMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
