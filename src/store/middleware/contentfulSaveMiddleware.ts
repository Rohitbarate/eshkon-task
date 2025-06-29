import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSaving, setSaved } from '../slices/layoutSlice';
import { saveLayoutConfigToLocalStorage } from '../../lib/layoutConfigLoader';

let saveTimeout: NodeJS.Timeout | null = null;

export const contentfulSaveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only save for layout changes that modify the state
  const layoutActions = [
    'layout/addComponent',
    'layout/removeComponent', 
    'layout/reorderComponents',
    'layout/undo',
    'layout/redo'
  ];
  
  if (layoutActions.includes(action.type)) {
    const state = store.getState();
    
    if (state.layout.isDirty && !state.layout.isSaving) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new timeout for autosave (debounced)
      saveTimeout = setTimeout(async () => {
        store.dispatch(setSaving(true));
        
        try {
          // Create the JSON configuration to save to Contentful
          const layoutConfig = {
            components: state.layout.components,
            updatedAt: new Date().toISOString(),
            version: '1.0',
            metadata: {
              totalComponents: state.layout.components.length,
              componentTypes: [...new Set(state.layout.components.map(c => c.type))],
              lastModifiedBy: 'page-builder',
            }
          };
          
          console.log('💾 Saving layout configuration:', layoutConfig);
          
          // REAL CONTENTFUL IMPLEMENTATION:
          // In a production Contentful app, this would use the App SDK:
          /*
          const sdk = window.contentfulExtension;
          const entry = sdk.entry;
          
          // Save the layout configuration as JSON to a field called 'layoutConfig'
          await entry.fields.layoutConfig.setValue(JSON.stringify(layoutConfig));
          
          // Update metadata fields
          await entry.fields.lastModified.setValue(new Date().toISOString());
          await entry.fields.componentCount.setValue(layoutConfig.components.length);
          
          // Publish the entry (optional)
          await sdk.space.publishEntry(entry);
          */
          
          // DEMO IMPLEMENTATION:
          // For demo purposes, save to localStorage (client-side only)
          await saveToContentfulDemo(layoutConfig);
          
          console.log('✅ Layout configuration saved successfully');
          store.dispatch(setSaved());
        } catch (error) {
          console.error('❌ Failed to save layout configuration:', error);
          // In production, you might want to show a user notification here
        } finally {
          store.dispatch(setSaving(false));
        }
      }, 2000); // 2 second debounce delay
    }
  }
  
  return result;
};

// Demo function that simulates saving to Contentful
async function saveToContentfulDemo(layoutConfig: any): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Save to localStorage for demo purposes
  saveLayoutConfigToLocalStorage(layoutConfig);
  
  // In a real implementation, this would be:
  // await contentfulManagementClient.entry.update(entryId, { layoutConfig });
  
  console.log('📝 Saved to demo storage (localStorage)');
}