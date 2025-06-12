/* eslint-disable @typescript-eslint/no-unused-vars */
import { Middleware } from "@reduxjs/toolkit";
import {
  resetEspacioEscolar,
  setRelevamientoId,
} from "../slices/espacioEscolarSlice";

export const relevamientoStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (setRelevamientoId.match(action)) {
      sessionStorage.setItem("relevamientoId", String(action.payload));
    }

    if (resetEspacioEscolar.match(action)) {
      sessionStorage.removeItem("relevamientoId");
    }

    return next(action);
  };
