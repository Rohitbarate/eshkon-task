import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { saveLayoutConfigToLocalStorage } from "../../utils/layoutStorage";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { markAsSaved } from "../slices/layoutSlice";

let saveTimeout: NodeJS.Timeout | null = null;

type LayoutAction =
  | { type: "layout/addBlock"; payload: any }
  | { type: "layout/moveBlock"; payload: any }
  | { type: "layout/undo" }
  | { type: "layout/redo" };

export const contentfulSaveMiddleware: Middleware =
  (store) => (next) => (action: LayoutAction | any) => {
    const result = next(action);

    const layoutActions = [
      "layout/addBlock",
      " layout/moveBlock",
      "layout/undo",
      "layout/redo",
    ];

    if (layoutActions.includes(action.type)) {
      const state = store.getState() as RootState;

      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(async () => {
        try {
          const layoutConfig = {
            // blocks: state.layout.blocks,
            // future: state.layout.future,
            // history: state.layout.history,
            ...state.layout,
            updatedAt: new Date().toISOString(),
            version: "1.0",
            metadata: {
              totalComponents: state.layout.blocks.length,
              componentTypes: [
                ...new Set(state.layout.blocks.map((c) => c.type)),
              ],
              lastModifiedBy: "page-builder",
            },
          };

          console.log("Saving layout configuration:", layoutConfig);

          saveLayoutConfigToLocalStorage(layoutConfig);

          store.dispatch(markAsSaved());

          console.log("Layout configuration saved successfully");
        } catch (error) {
          console.error("Failed to save layout configuration:", error);
        } finally {
        }
      }, 2000);
    }

    return result;
  };
