import { HeroData, ImageGridData, TwoColumnData } from "@/types/contentful";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BlockType = "hero" | "twoColumn" | "imageGrid";

export interface Block {
  id: string;
  type: BlockType;
  contentId?: string;
  order: number;
  data: HeroData | TwoColumnData | ImageGridData;
}

export interface LayoutConfig {
  blocks: Block[];
  history?: LayoutConfig[];
  future?: LayoutConfig[];
  isSaved: boolean;
}

const initialState: LayoutConfig = {
  blocks: [],
  history: [],
  future: [],
  isSaved: true,
};

function snapshotState(state: LayoutConfig): LayoutConfig {
  return {
    blocks: [...state.blocks],
    isSaved: state.isSaved,
  };
}

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setBlocks(state, action: PayloadAction<Block[]>) {
      state.blocks = action.payload;
    },
    addBlock(state, action: PayloadAction<Block>) {
      if (state.blocks.length > 0) {
        state.history?.push(snapshotState(state));
      } else {
        state.history?.push({
          blocks: [],
          isSaved: true,
        });
      }
      state.blocks.push(action.payload);
      state.future = [];
      state.isSaved = false;
    },
    moveBlock(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const updated = [...state.blocks];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      state.history?.push(snapshotState(state));
      state.blocks = updated;
      state.future = [];
      state.isSaved = false;
    },
    undo(state) {
      const prev = state.history?.pop();
      if (prev) {
        state.future?.push(snapshotState(state));
        state.blocks = prev.blocks;
        state.isSaved = false;
      }
    },
    redo(state) {
      const next = state.future?.pop();
      if (next) {
        state.history?.push(snapshotState(state));
        state.blocks = next.blocks;
        state.isSaved = false;
      }
    },
    clearHistory(state) {
      state.history = [];
      state.future = [];
    },
    markAsSaved(state) {
      state.isSaved = true;
    },
  },
});

export const {
  setBlocks,
  addBlock,
  moveBlock,
  undo,
  redo,
  clearHistory,
  markAsSaved,
} = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
