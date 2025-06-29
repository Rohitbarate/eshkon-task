'use client';

import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { reorderComponents, addComponent, undo, redo, setComponents } from '../../store/slices/layoutSlice';
import { LayoutComponent } from '../../types/contentful';
import ComponentPreview from './ComponentPreview';
import ComponentPalette from './ComponentPalette';
import { Droppable } from '../Droppable';
import { Draggable } from '../Draggable';
import styles from './PageBuilder.module.css';

interface PageBuilderProps {
  initialComponents?: LayoutComponent[];
}

const PageBuilder: React.FC<PageBuilderProps> = ({ initialComponents = [] }) => {
  const dispatch = useAppDispatch();
  const { components, historyIndex, history, isDirty, isSaving, lastSaved } = useAppSelector(
    (state) => state.layout
  );
  const [activeId, setActiveId] = React.useState<string | null>(null);

  useEffect(() => {
    if (initialComponents.length > 0) {
      dispatch(setComponents(initialComponents));
    }
  }, [initialComponents, dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging from palette to canvas
    if (['hero', 'twoColumn', 'imageGrid'].includes(activeId) && overId === 'canvas') {
      const componentType = activeId as 'hero' | 'twoColumn' | 'imageGrid';
      const newComponent: LayoutComponent = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        order: components.length,
        data: getDefaultComponentData(componentType),
      };
      
      dispatch(addComponent(newComponent));
    }
    // Check if reordering within canvas
    else if (components.find(c => c.id === activeId) && components.find(c => c.id === overId)) {
      const activeIndex = components.findIndex(c => c.id === activeId);
      const overIndex = components.findIndex(c => c.id === overId);
      
      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        dispatch(reorderComponents({
          sourceIndex: activeIndex,
          destinationIndex: overIndex,
        }));
      }
    }
  };

  const getDefaultComponentData = (type: 'hero' | 'twoColumn' | 'imageGrid') => {
    switch (type) {
      case 'hero':
        return {
          heading: 'Hero Heading',
          subtitle: 'Hero subtitle text goes here',
          ctaText: 'Get Started',
          ctaUrl: '#',
          backgroundImage: {
            sys: { id: 'placeholder' },
            title: 'Placeholder Image',
            url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1200',
            width: 1200,
            height: 600,
            contentType: 'image/jpeg',
          },
        };
      case 'twoColumn':
        return {
          leftHeading: 'Two Column Heading',
          leftSubtitle: 'Description text for the left column',
          leftCtaText: 'Learn More',
          leftCtaUrl: '#',
          rightImage: {
            sys: { id: 'placeholder' },
            title: 'Placeholder Image',
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
            width: 800,
            height: 600,
            contentType: 'image/jpeg',
          },
        };
      case 'imageGrid':
        return {
          images: [
            {
              sys: { id: 'placeholder-1' },
              title: 'Grid Image 1',
              url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'placeholder-2' },
              title: 'Grid Image 2',
              url: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'placeholder-3' },
              title: 'Grid Image 3',
              url: 'https://images.pexels.com/photos/3184321/pexels-photo-3184321.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'placeholder-4' },
              title: 'Grid Image 4',
              url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
          ],
        };
      default:
        return {};
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const getSaveStatus = () => {
    if (isSaving) return { text: 'Saving...', className: styles.savingIndicator };
    if (isDirty) return { text: 'Unsaved changes', className: styles.unsavedIndicator };
    if (lastSaved) return { 
      text: `Saved ${new Date(lastSaved).toLocaleTimeString()}`, 
      className: styles.savedIndicator 
    };
    return null;
  };

  const saveStatus = getSaveStatus();

  return (
    <div className={styles.pageBuilder}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            className={styles.toolbarButton}
            title="Undo last action"
          >
            ↶ Undo
          </button>
          <button
            onClick={() => dispatch(redo())}
            disabled={!canRedo}
            className={styles.toolbarButton}
            title="Redo last action"
          >
            ↷ Redo
          </button>
        </div>
        <div className={styles.toolbarRight}>
          {saveStatus && (
            <span className={saveStatus.className}>
              {saveStatus.text}
            </span>
          )}
        </div>
      </div>

      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className={styles.builderContent}>
          <div className={styles.palette}>
            <h3 className={styles.paletteTitle}>Components</h3>
            <ComponentPalette />
          </div>

          <div className={styles.canvas}>
            <h3 className={styles.canvasTitle}>Page Layout</h3>
            <Droppable id="canvas">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.canvasArea} ${
                    snapshot.isDraggingOver ? styles.canvasAreaDragging : ''
                  }`}
                >
                  {components.length === 0 && (
                    <div className={styles.emptyCanvas}>
                      <p>Drag components from the palette to build your page</p>
                    </div>
                  )}
                  <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {components.map((component, index) => (
                      <Draggable key={component.id} id={component.id} index={index} sortable={true}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${styles.componentItem} ${
                              snapshot.isDragging ? styles.componentItemDragging : ''
                            }`}
                          >
                            <ComponentPreview component={component} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </SortableContext>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className={styles.dragOverlay}>
              {['hero', 'twoColumn', 'imageGrid'].includes(activeId) 
                ? `Adding ${activeId} component`
                : `Moving component`
              }
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default PageBuilder;