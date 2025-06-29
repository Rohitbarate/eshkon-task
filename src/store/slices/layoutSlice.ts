import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LayoutComponent } from '../../types/contentful';
import { LayoutState } from '../../types/redux';

const initialState: LayoutState = {
  components: [],
  history: [[]],
  historyIndex: 0,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setComponents: (state, action: PayloadAction<LayoutComponent[]>) => {
      state.components = action.payload;
      state.history = [action.payload];
      state.historyIndex = 0;
      state.isDirty = false;
    },
    reorderComponents: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const newComponents = Array.from(state.components);
      const [reorderedItem] = newComponents.splice(sourceIndex, 1);
      newComponents.splice(destinationIndex, 0, reorderedItem);
      
      // Update order values
      newComponents.forEach((component, index) => {
        component.order = index;
      });

      state.components = newComponents;
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...newComponents]);
      state.historyIndex = state.history.length - 1;
      state.isDirty = true;

      // Limit history to 50 entries
      if (state.history.length > 50) {
        state.history = state.history.slice(-50);
        state.historyIndex = state.history.length - 1;
      }
    },
    addComponent: (state, action: PayloadAction<LayoutComponent>) => {
      const newComponent = { ...action.payload, order: state.components.length };
      state.components.push(newComponent);
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.components]);
      state.historyIndex = state.history.length - 1;
      state.isDirty = true;
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(c => c.id !== action.payload);
      state.components.forEach((component, index) => {
        component.order = index;
      });
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.components]);
      state.historyIndex = state.history.length - 1;
      state.isDirty = true;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.components = [...state.history[state.historyIndex]];
        state.isDirty = true;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.components = [...state.history[state.historyIndex]];
        state.isDirty = true;
      }
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
  },
});

export const {
  setComponents,
  reorderComponents,
  addComponent,
  removeComponent,
  undo,
  redo,
  setSaving,
  setSaved,
} = layoutSlice.actions;

export default layoutSlice.reducer;