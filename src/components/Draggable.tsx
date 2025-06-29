import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  index?: number;
  children: (provided: {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: Record<string, any>;
    dragHandleProps: Record<string, any>;
  }, snapshot: { isDragging: boolean }) => React.ReactNode;
  sortable?: boolean;
}

export function Draggable({ id, children, sortable = false }: DraggableProps) {
  // Use sortable for canvas items, draggable for palette items
  const sortableProps = useSortable({
    id,
    disabled: !sortable,
  });
  
  const draggableProps = useDraggable({
    id,
    disabled: sortable,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = sortable ? sortableProps : draggableProps;

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const provided = {
    innerRef: setNodeRef,
    draggableProps: {
      style,
      ...attributes,
    },
    dragHandleProps: listeners,
  };

  const snapshot = {
    isDragging,
  };

  return <>{children(provided, snapshot)}</>;
}