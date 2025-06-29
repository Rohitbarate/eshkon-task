import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSaving, setSaved } from '../slices/layoutSlice';
import { saveLayoutConfigToLocalStorage } from '../../lib/layoutConfigLoader';

let saveTimeout: NodeJS.Timeout | null = null;

type LayoutAction =
  | { type: 'layout/addComponent'; payload: any }
  | { type: 'layout/removeComponent'; payload: any }
  | { type: 'layout/reorderComponents'; payload: any }
  | { type: 'layout/undo' }
  | { type: 'layout/redo' };

export const contentfulSaveMiddleware: Middleware = (store) => (next) => (action: LayoutAction | any) => {
  const result = next(action);

  const layoutActions = [
    'layout/addComponent',
    'layout/removeComponent',
    'layout/reorderComponents',
    'layout/undo',
    'layout/redo',
  ];

  if (layoutActions.includes(action.type)) {
    const state = store.getState() as RootState;

    if (state.layout.isDirty && !state.layout.isSaving) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(async () => {
        store.dispatch(setSaving(true));

        try {
          const layoutConfig = {
            components: state.layout.components,
            updatedAt: new Date().toISOString(),
            version: '1.0',
            metadata: {
              totalComponents: state.layout.components.length,
              componentTypes: [...new Set(state.layout.components.map((c) => c.type))],
              lastModifiedBy: 'page-builder',
            },
          };

          console.log('💾 Saving layout configuration:', layoutConfig);

          await saveToContentfulDemo(layoutConfig);

          console.log('Layout configuration saved successfully');
          store.dispatch(setSaved());
        } catch (error) {
          console.error('Failed to save layout configuration:', error);
        } finally {
          store.dispatch(setSaving(false));
        }
      }, 2000);
    }
  }

  return result;
};

// Demo function that simulates saving to Contentful
async function saveToContentfulDemo(layoutConfig: any): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  saveLayoutConfigToLocalStorage(layoutConfig);
  console.log('📝 Saved to demo storage (localStorage)');
}
