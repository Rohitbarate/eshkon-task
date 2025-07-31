"use client";

import { configureStore } from "@reduxjs/toolkit";
import { layoutReducer } from "./slices/layoutSlice";
import { undoRedoMiddleware } from "./middleware/undoRedoMiddleware";
import { saveLayoutMiddleware } from "./middleware/saveLayoutMiddleware";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { autosaveMiddleware } from "./middleware/autosaveMiddleware";
import { contentfulSaveMiddleware } from "./middleware/contentfulSaveMiddleware";

const persistConfig = {
  key: "contentful-layout",
  storage,
};

const persistedReducer = persistReducer(persistConfig, layoutReducer);

export const store = configureStore({
  reducer: {
    layout: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(contentfulSaveMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
