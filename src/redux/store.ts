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
import storage from "redux-persist/lib/storage";
import espacioEscolarReducer from "./slices/espacioEscolarSlice";
import institucionReducer from "./slices/institucionSlice";

// Combinar los reducers
const rootReducer = combineReducers({
  espacio_escolar: espacioEscolarReducer,
  institucion: institucionReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

//console.log("Tipo de espacioEscolarReducer:", typeof espacioEscolarReducer);
//console.log("Tipo de institucionReducer:", typeof institucionReducer);

const persistedReducer = persistReducer(persistConfig, rootReducer);

//console.log("Tipo de persistedReducer:", typeof persistedReducer);

export const store = configureStore({
  reducer: persistedReducer, // Cambiado para usar persistedReducer directamente
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
