import { LayoutComponent } from './contentful';

export interface AppState {
  layout: LayoutState;
}

export interface LayoutState {
  components: LayoutComponent[];
  history: LayoutComponent[][];
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: string | null;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination: {
    index: number;
    droppableId: string;
  } | null;
}