import { Middleware } from "@reduxjs/toolkit";

export const undoRedoMiddleware: Middleware = () => (next) => (action) => {
  // You can add custom logic for logging or analytics here
  return next(action);
};
