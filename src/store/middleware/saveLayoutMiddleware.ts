import { Dispatch, Middleware, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { saveLayoutConfigToLocalStorage } from "../../utils/layoutStorage";

let timer: NodeJS.Timeout | null = null;

export const saveLayoutMiddleware: Middleware<
  Dispatch<UnknownAction>,
  RootState
> = (store) => (next) => (action: any) => {
  const result = next(action);

  if (process.env.NODE_ENV === "development") {
    console.log("[Layout Action]:", action.type, action.payload);
  }

  const actionsToTrack = ["layout/addBlock", "layout/moveBlock"];

  if (actionsToTrack.includes(action.type)) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const state = store.getState();
      saveLayoutConfigToLocalStorage(state.layout);
    }, 500);
  }

  return result;
};
