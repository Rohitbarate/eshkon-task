import { Middleware, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSaving, setSaved } from '../slices/layoutSlice';

let autosaveTimeout: NodeJS.Timeout | null = null;

export const autosaveMiddleware: Middleware<Dispatch<UnknownAction>, RootState> = (store) => (next) => (action) => {
  const result = next(action);

  if (
   action && typeof action === 'object' && action !== null && 'type' in action && typeof (action as { type: unknown }).type === 'string' &&
    (action as { type: string }).type.startsWith('layout/') &&
    (action as { type: string }).type !== 'layout/setSaving' &&
    (action as { type: string }).type !== 'layout/setSaved'
  ) {
    const state = store.getState();

    if (state.layout.isDirty && !state.layout.isSaving) {
      if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
      }

      autosaveTimeout = setTimeout(async () => {
        store.dispatch(setSaving(true));

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          console.log('Autosaved layout:', state.layout.components);
          store.dispatch(setSaved());
        } catch (error) {
          console.error('Autosave failed:', error);
        } finally {
          store.dispatch(setSaving(false));
        }
      }, 2000);
    }
  }

  return result;
};
