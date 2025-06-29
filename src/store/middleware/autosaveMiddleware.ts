import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSaving, setSaved } from '../slices/layoutSlice';

let autosaveTimeout: NodeJS.Timeout | null = null;

export const autosaveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only autosave for layout changes
  if (action.type.startsWith('layout/') && action.type !== 'layout/setSaving' && action.type !== 'layout/setSaved') {
    const state = store.getState();
    
    if (state.layout.isDirty && !state.layout.isSaving) {
      // Clear existing timeout
      if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
      }
      
      // Set new timeout for autosave
      autosaveTimeout = setTimeout(async () => {
        store.dispatch(setSaving(true));
        
        try {
          // In a real app, this would save to Contentful
          // For now, we'll just simulate the save
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Autosaved layout:', state.layout.components);
          store.dispatch(setSaved());
        } catch (error) {
          console.error('Autosave failed:', error);
        } finally {
          store.dispatch(setSaving(false));
        }
      }, 2000); // 2 second delay
    }
  }
  
  return result;
};