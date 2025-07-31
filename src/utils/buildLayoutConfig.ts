import { LayoutConfig } from "../store/slices/layoutSlice";

export function buildEnhancedLayoutConfig(state: LayoutConfig) {
  return {
    components: state.blocks,
    updatedAt: new Date().toISOString(),
    version: "1.0",
    metadata: {
      totalComponents: state.blocks.length,
      componentTypes: [...new Set(state.blocks.map((c) => c.type))],
      lastModifiedBy: "page-builder",
    },
  };
}

export function cloneForHistory(state: LayoutConfig): LayoutConfig {
  return {
    blocks: JSON.parse(JSON.stringify(state.blocks)),
    history: [],
    future: [],
    isSaved: state.isSaved,
  };
}
